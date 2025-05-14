import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'archive'));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newDoc = {
      ...body,
      date: Timestamp.fromDate(new Date(body.date)),
    dateAdded: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'archive'), newDoc);
    return Response.json({ success: true, id: docRef.id });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
