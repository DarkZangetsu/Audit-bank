-- Migration: create_triggers
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
DROP TRIGGER IF EXISTS compte_audit_trigger ON compte;
CREATE TRIGGER compte_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON compte
FOR EACH ROW EXECUTE FUNCTION audit_compte_changes();