import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: auth.id },
      include: { permissions: true }
    });

    if (!user?.permissions?.[0]?.canUpdate) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const { nomclient, solde } = await req.json();
    const { numero } = params;

    const oldCompte = await db.compte.findUnique({
      where: { numero }
    });

    if (!oldCompte) {
      return NextResponse.json({ error: 'Compte non trouvé' }, { status: 404 });
    }

    // Convertir le solde en nombre avant de l'enregistrer
    const soldeNumber = parseFloat(solde);
    if (isNaN(soldeNumber)) {
      return NextResponse.json({ error: 'Solde invalide' }, { status: 400 });
    }

    const compte = await db.compte.update({
      where: { numero },
      data: {
        nomclient,
        solde: soldeNumber
      }
    });

    await db.auditCompte.create({
      data: {
        typeAction: 'modification',
        numeroCompte: compte.numero,
        nomclient: compte.nomclient,
        soldeAncien: oldCompte.solde,
        soldeNouveau: soldeNumber,
        utilisateur: user.username
      }
    });

    return NextResponse.json(compte);
  } catch (error) {
    console.error('Error in PUT /api/accounts/[numero]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: auth.id },
      include: { permissions: true }
    });

    if (!user?.permissions?.[0]?.canDelete) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const { numero } = params;

    const compte = await db.compte.findUnique({
      where: { numero }
    });

    if (!compte) {
      return NextResponse.json({ error: 'Compte non trouvé' }, { status: 404 });
    }

    await db.compte.delete({
      where: { numero }
    });

    await db.auditCompte.create({
      data: {
        typeAction: 'suppression',
        numeroCompte: compte.numero,
        nomclient: compte.nomclient,
        soldeAncien: compte.solde,
        soldeNouveau: null,
        utilisateur: user.username
      }
    });

    return NextResponse.json(compte);
  } catch (error) {
    console.error('Error in DELETE /api/accounts/[numero]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}