import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, getDoc,setDoc ,Timestamp } from 'firebase/firestore';

export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updateData = {
      ...body,
      date: Timestamp.fromDate(new Date(body.date)),
    };
    await updateDoc(doc(db, 'archive', id), updateData);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const originalDocRef = doc(db, 'archive', id);
    const snapshot = await getDoc(originalDocRef);

    if (!snapshot.exists()) {
      return Response.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    const data = snapshot.data();

    // Save to `archive_deleted` collection
    const deletedDocRef = doc(db, 'archive_deleted', id);
    await setDoc(deletedDocRef, {
      ...data,
      dateDeleted: Timestamp.now(),
    });

    // Delete from the original collection
    await deleteDoc(originalDocRef);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
