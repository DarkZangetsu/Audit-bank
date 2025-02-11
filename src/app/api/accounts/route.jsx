import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { Decimal } from '@prisma/client/runtime/library';

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comptes = await db.compte.findMany();
    return NextResponse.json(comptes);
  } catch (error) {
    console.error('Error in GET /api/accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: auth.id },
      include: { permissions: true }
    });

    if (!user?.permissions?.[0]?.canInsert) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    const { numero, nomclient, solde } = await req.json();
    
    // Vérifier si le compte existe déjà
    const existingCompte = await db.compte.findUnique({
      where: { numero }
    });

    if (existingCompte) {
      return NextResponse.json(
        { error: 'Un compte avec ce numéro existe déjà' },
        { status: 400 }
      );
    }

    // S'assurer que solde est un nombre valide
    if (isNaN(solde)) {
      return NextResponse.json(
        { error: 'Le solde doit être un nombre valide' },
        { status: 400 }
      );
    }

    const compte = await db.compte.create({
      data: {
        numero,
        nomclient,
        solde: new Decimal(solde)
      }
    });

    await db.auditCompte.create({
      data: {
        typeAction: 'ajout',
        numeroCompte: numero,
        nomclient,
        soldeNouveau: new Decimal(solde),
        utilisateur: user.username
      }
    });

    return NextResponse.json(compte);
  } catch (error) {
    console.error('Error in POST /api/accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}