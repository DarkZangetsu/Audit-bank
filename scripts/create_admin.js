const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Chercher d'abord le rôle ADMIN
    let adminRole = await prisma.role.findFirst({
      where: { roleName: 'ADMIN' }
    });

    // Créer le rôle s'il n'existe pas
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { roleName: 'ADMIN' }
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'utilisateur admin
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        passwordHash: hashedPassword,
        roleId: adminRole.id,
        permissions: {
          create: {
            canInsert: true,
            canUpdate: true,
            canDelete: true
          }
        }
      }
    });

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();