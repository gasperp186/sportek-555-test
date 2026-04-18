import { db } from "@/lib/firebase";
import { doc, collection, query, where, documentId, arrayUnion, arrayRemove, getDoc, getDocs, updateDoc} from "firebase/firestore";
import { useParams } from "next/navigation";

import { useState, useEffect } from "react";

import classes from "./Dostop.module.css"


export default function Dostop({data, onChange}) {

    const [editors, setEditors] = useState([]);
    const [email, setEmail] = useState("");

    const { id } = useParams();
    const  [newEmail, setNewEmail] = useState("");
    const [ foundUser, setFoundUser] = useState(null);


    // 1. useEffect za nalaganje seznama (sproži se ob spremembi ID-ja tekmovanja)
useEffect(() => {
    async function getData() {
        const compRef = doc(db, "competitions", id);
        const compShot = await getDoc(compRef);
        if (!compShot.exists()) return;

        const uids = compShot.data().editors || [];
        if (uids.length > 0) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where(documentId(), "in", uids));
            const usersShot = await getDocs(q);
            setEditors(usersShot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
    }
    getData();
}, [id]);

// 2. useEffect za iskanje uporabnika (sproži se, ko TIPKAŠ)
useEffect(() => {
    async function searchUser() {
        if (newEmail.includes('@') && newEmail.includes('.')) {
            const q = query(collection(db, "users"), where("email", "==", newEmail));
            const queryUsersShot = await getDocs(q);

            if (!queryUsersShot.empty) {
                const userDoc = queryUsersShot.docs[0];
                setFoundUser({
                    id: userDoc.id,       // ID vzameš iz dokumenta
                    ...userDoc.data()     // Podatke vzameš s funkcijo .data()
                });
            } else {
                setFoundUser(null);
            }
        } else {
            setFoundUser(null);
        }
    }
    searchUser();
}, [newEmail]); // Pomembno: posluša newEmail!


    async function removeEditor(editorId) {
        
        const compRef = doc(db, "competitions", id);
        
        
            await updateDoc(compRef, {
            editors: arrayRemove(editorId)
            
        });

        setEditors(editors.filter(ed => ed.id !== editorId))
    }

    async function addEditor() {
        if(!foundUser) {
            return;
        }

        const compRef = doc(db, "competitions", id);

        await updateDoc(compRef, {
            editors: arrayUnion(foundUser.id)
        })

        setEditors([...editors, foundUser]);

        setNewEmail("");
        setFoundUser(null);
        


    }


    return(
       <div className={classes.wrapper}>
      <h3 className={classes.title}>Dostop</h3>

      <div>
        <input 
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        />
            {foundUser && (
  <div>
    <p className={classes.text}>Najden: {foundUser.name} {foundUser.surname}</p>
    <button onClick={addEditor}>Dodaj</button>
  </div>
)}

{/* 2. Če je email v celoti vpisan, uporabnika pa NI v foundUser */}
{newEmail.includes('@') && newEmail.includes('.') && !foundUser && (
  <div>
    <p>Uporabnik s tem naslovom še ni registriran.</p>
  </div>
)}
      </div>

      <div>
        <h2 className={classes.text}>Seznam urednikov</h2>
        {editors.map((editor) => (
            <div className={classes.text} key={editor.id}>
                <li>{editor.email} - {editor.name} {editor.surname}</li> <button onClick={() => removeEditor(editor.id)}>Odstrani</button>
            </div>
            
        ))}
      </div>

      
    </div>
    )


}