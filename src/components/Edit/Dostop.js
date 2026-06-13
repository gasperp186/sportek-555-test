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


    return (
  <div className={classes.wrapper}>
    <h2 className={classes.title}>Dostop</h2>

    {/* Iskalni del */}
    <div className={classes.inputGroup}>
      <h4 className={classes.podnaslov}>Dodaj novega urednika</h4>
      <input
        type="email"
        placeholder="Vpišite elektronski naslov uporabnika"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />

      {foundUser && (
        <div className={classes.foundBox}>
          <p className={classes.text}>
            <strong>Najden:</strong> {foundUser.name} {foundUser.surname}
          </p>
          <button className={classes.addButton} onClick={addEditor}>Dodaj</button>
        </div>
      )}

      {newEmail.includes('@') && newEmail.includes('.') && !foundUser && (
        <div className={classes.text} style={{color: '#d32f2f', fontSize: '14px'}}>
          <p>Uporabnik s tem naslovom še ni registriran.</p>
        </div>
      )}
    </div>

    {/* Seznam urednikov */}
    <div className={classes.seznamBox}>
      <h4 className={classes.podnaslov}>
        Seznam trenutnih urednikov
      </h4>
      <ul className={classes.editorList}>
        {editors.length === 0 && <p className={classes.text} >Ni dodanih urednikov.</p>}
        {editors.map((editor) => (
          <li className={classes.editorItem} key={editor.id}>
            <div className={classes.teamInfo}>
              <span className={classes.teamName}>{editor.name} {editor.surname}</span>
              <small className={classes.userName}>{editor.email}</small>
            </div>
            <button className={classes.removeButton} onClick={() => removeEditor(editor.id)}>
              Odstrani
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);


}