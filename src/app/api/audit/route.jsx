import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  const auth = await verifyAuth(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const typeAction = searchParams.get('typeAction');

  try {
    const where = {};
    
    if (startDate && endDate) {
      where.dateAction = {
        gte: new Date(`${startDate}T00:00:00.000Z`),
        lte: new Date(`${endDate}T23:59:59.999Z`)
      };
    }
    
    // Adapter le type d'action selon les valeurs du trigger
    if (typeAction && typeAction !== 'all') {
      where.typeAction = typeAction === 'CREATE' ? 'ajout' :
                        typeAction === 'UPDATE' ? 'modification' :
                        typeAction === 'DELETE' ? 'suppression' :
                        typeAction;
    }

    const logs = await db.auditCompte.findMany({
      where,
      orderBy: { dateAction: 'desc' }
    });

    const statsRaw = await db.auditCompte.groupBy({
      by: ['typeAction'],
      _count: {
        typeAction: true
      }
    });

    const stats = statsRaw.map(stat => ({
      typeAction: stat.typeAction,
      count: stat._count.typeAction
    }));

    return NextResponse.json({ logs, stats });
  } catch (error) {
    console.error('Error fetching audit data:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des données' },
      { status: 500 }
    );
  }
}