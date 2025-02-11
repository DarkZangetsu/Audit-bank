import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const userId = parseInt(id);
    const { username, role, permissions } = await req.json();

    // First, find the role
    const roleRecord = await db.role.findFirst({
      where: { roleName: role }
    });

    if (!roleRecord) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Update the user basic info and role
    const user = await db.user.update({
      where: { id: userId },
      data: {
        username,
        roleId: roleRecord.id,
      },
      include: {
        role: true,
        permissions: true
      }
    });

    // Update permissions separately
    await db.permission.updateMany({
      where: { userId },
      data: {
        canInsert: permissions?.canInsert || false,
        canUpdate: permissions?.canUpdate || false,
        canDelete: permissions?.canDelete || false
      }
    });

    // Get the updated user with all relations
    const updatedUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        permissions: true
      }
    });

    const transformedUser = {
      ...updatedUser,
      role: {
        roleName: updatedUser.role.roleName
      },
      permissions: {
        canInsert: updatedUser.permissions[0]?.canInsert || false,
        canUpdate: updatedUser.permissions[0]?.canUpdate || false,
        canDelete: updatedUser.permissions[0]?.canDelete || false
      }
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const userId = parseInt(id);

    await db.permission.deleteMany({
      where: { userId }
    });

    await db.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}