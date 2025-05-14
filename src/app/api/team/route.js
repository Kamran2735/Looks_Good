import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs,addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'team_members'));
    const team = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { sourceId, newId } = await request.json();

    // Fetch existing document
    const sourceRef = doc(db, 'team_members', sourceId);
    const sourceSnap = await getDoc(sourceRef);

    if (!sourceSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Source document not found' }, { status: 404 });
    }

    // Duplicate to new ID

    const teamCollection = collection(db, 'team_members');
    await addDoc(teamCollection, sourceSnap.data());
    

    return NextResponse.json({ success: true, message: 'Document duplicated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
