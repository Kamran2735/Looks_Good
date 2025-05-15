import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request, context) {
  const { params } = context;
  const slug = params.team_member;

  try {
    // Query Firestore collection for a document where slug matches
    const teamRef = collection(db, 'team_members');
    const q = query(teamRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const doc = querySnapshot.docs[0];
    const teamMember = { id: doc.id, ...doc.data() };

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}
