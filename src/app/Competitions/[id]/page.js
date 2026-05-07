import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import CompetitionDetails from "@/components/Competitions/CompetitionDetails";
import ScreenshotButton from "./ScreenshotButton"; // <--- Uvozi gumb
import classes from "./Id.module.css";
import RulesButton from "@/components/RulesButton";
import BackButton from "@/components/BackButton";
import Legenda from "@/components/Legenda";
import { formatDate } from "@/components/formatDate";

export default async function Page({ params }) {
  const { id } = await params; 

  const docRef = doc(db, "competitions", id);
  const docSnap = await getDoc(docRef);


  if(!docSnap.exists()) return <div>Tekmovanje ni bilo najdeno</div>;
  
  const rawData = docSnap.data();
  const comp = {
    ...rawData, 
    id: docSnap.id, 
    createdAt: rawData.createdAt?.toDate().toISOString() || null
  };

 

  return(
    <div className={classes.page}>
      <div className={classes.card}>
        <h2 className={classes.title}>{comp.title}</h2>
        <p className={classes.subtitle}>
          <strong>Šport:</strong> {comp.sport} | <strong>Kraj:</strong> {comp.city} | {
  comp.mode === "bracket" || comp.mode === "knockout" ? (
    <>
      <strong>Datum:</strong> {formatDate(comp.startDate)} - {formatDate(comp.endDate)}
    </>
  ) : (
    <>
      <strong>Sezona:</strong> {comp.season}
    </>
  )
}
        </p> 
        <CompetitionDetails id={id} initialData={comp} isEditMode={true} />
        <div>
        {/* Gumb uporabiš tukaj in mu poveš, kaj naj "slika" */}
        
        <ScreenshotButton 
  comp={comp} 
  width="900px" // Malo več kot container2 (1200px + padding)
  height="700px" 
  contentToExport={
    
       <CompetitionDetails id={id} initialData={comp} isExport={true} />
    
  }
/>
        <div className={classes.vrsta}>

          <Legenda />

          <RulesButton rules={comp.rulesText}/>

        </div>
       
 
      

       
      </div>
      <BackButton/>
      
      </div>
      

      
    </div>
  );
}