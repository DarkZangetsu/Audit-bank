-- Users and roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client accounts
CREATE TABLE compte (
    numero VARCHAR(50) PRIMARY KEY,
    nomclient VARCHAR(100) NOT NULL,
    solde DECIMAL(15,2) NOT NULL
);

-- Audit table
CREATE TABLE audit_compte (
    id SERIAL PRIMARY KEY,
    type_action VARCHAR(20) NOT NULL,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    numero_compte VARCHAR(50) NOT NULL,
    nomclient VARCHAR(100) NOT NULL,
    solde_ancien DECIMAL(15,2),
    solde_nouveau DECIMAL(15,2),
    utilisateur VARCHAR(100) NOT NULL
);

-- Permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    can_insert BOOLEAN DEFAULT false,
    can_update BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false
);

-- Trigger function for auditing
CREATE OR REPLACE FUNCTION audit_compte_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_compte (
            type_action, numero_compte, nomclient,
            solde_ancien, solde_nouveau, utilisateur
        )
        VALUES (
            'ajout', NEW.numero, NEW.nomclient,
            NULL, NEW.solde, current_user
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_compte (
            type_action, numero_compte, nomclient,
            solde_ancien, solde_nouveau, utilisateur
        )
        VALUES (
            'modification', NEW.numero, NEW.nomclient,
            OLD.solde, NEW.solde, current_user
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_compte (
            type_action, numero_compte, nomclient,
            solde_ancien, solde_nouveau, utilisateur
        )
        VALUES (
            'suppression', OLD.numero, OLD.nomclient,
            OLD.solde, NULL, current_user
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER compte_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON compte
FOR EACH ROW EXECUTE FUNCTION audit_compte_changes();