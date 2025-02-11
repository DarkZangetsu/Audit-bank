import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await db.user.findMany({
      include: {
        role: true,
        permissions: true
      }
    });

    const transformedUsers = users.map(user => ({
      ...user,
      role: {
        roleName: user.role?.roleName || 'Non défini'
      },
      permissions: {
        canInsert: user.permissions[0]?.canInsert || false,
        canUpdate: user.permissions[0]?.canUpdate || false,
        canDelete: user.permissions[0]?.canDelete || false
      }
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password, role, permissions } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Trouver ou créer le rôle
    let roleRecord = await db.role.findFirst({
      where: { roleName: role }
    });

    if (!roleRecord) {
      roleRecord = await db.role.create({
        data: { roleName: role }
      });
    }

    const user = await db.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        roleId: roleRecord.id,
        permissions: {
          create: {
            canInsert: permissions?.canInsert || false,
            canUpdate: permissions?.canUpdate || false,
            canDelete: permissions?.canDelete || false
          }
        }
      },
      include: {
        role: true,
        permissions: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}