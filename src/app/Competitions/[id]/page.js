import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import CompetitionDetails from "@/components/Competitions/CompetitionDetails";
import ScreenshotButton from "./ScreenshotButton"; // <--- Uvozi gumb
import classes from "./Id.module.css";
import RulesButton from "@/components/RulesButton";
import BackButton from "@/components/BackButton";
import Legenda from "@/components/Legenda";
import { formatDate } from "@/components/formatDate";
import classes2 from "@/components/Competitions/LeagueScreenShot.module.css"

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

  // Preverimo, če je način nastavljen na form_only
  const isFormOnly = comp.publishMode === "FORM_ONLY";

  const ozjaVrsta = (comp.mode === "knockout" && comp.maxTeams === 4);
  const sirsaVrsta = (comp.mode === "knockout" && comp.maxTeams === 16);


  let screenshotConfig = {
    width: "950px",
    height: "800px",
    
    
  };

  if (comp.mode === "ligaski") {
    // Pri ligi potrebuješ širši plakat, vsebina pa se pomakne višje
    screenshotConfig = {
      width: "900px",
      height: "1100px", 
      
    };

  };
  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <h2 className={classes.title}>{comp.title}</h2>
<div className={classes.subtitle}>
  {/* Prva vrstica: Šport in Kraj ostaneta vedno skupaj */}
  <div className={classes.metaGroup}>
    <div>
      <strong>Šport:</strong> {comp.sport}
    </div>
    <span className={classes.separator}>|</span>
    <div>
      <strong>Kraj:</strong> {comp.city}
    </div>
    <span className={classes.separator}>|</span>
  </div>
  
  {/* Druga vrstica: Datum ali Sezona */}
  <div className={classes.dateGroup}>
    {comp.mode === "bracket" || comp.mode === "knockout" ? (
      <>
        <strong>Datum:</strong> {
          !comp.endDate || comp.startDate === comp.endDate 
            ? formatDate(comp.startDate) 
            : `${formatDate(comp.startDate)} - ${formatDate(comp.endDate)}`
        }
      </>
    ) : (
      <>
        <strong>Sezona:</strong> {comp.season}
      </>
    )}
  </div>

  
  
</div>
        
        <CompetitionDetails id={id} initialData={comp} isEditMode={true} />
        
        {/* Če je form_only, z inline stilom preglasimo flex postavitev na center */}
        
        <div  
          className={`
                    ${ozjaVrsta ? classes.ozjaVrsta : classes.vrsta} 
                  
                    
                  `}
          style={isFormOnly ? { justifyContent: 'center' } : {}}
        >


          {/* Legenda se prikaže samo, če NI form_only */}
          {!isFormOnly && <Legenda />}
          
          {/* Screenshot gumb se prikaže samo, če NI form_only */}
          {!isFormOnly && (
            <div className={classes.screenShotDiv}>
              <ScreenshotButton 
                comp={comp}
                className={classes.screenshootButton} 
                width={screenshotConfig.width}
                height={screenshotConfig.height} 
                contentToExport={
                  <CompetitionDetails id={id} initialData={comp} isExport={true} />
                }
              />
            </div>
          )}

          <RulesButton rules={comp.rulesText}/>
        </div>
       
        <BackButton/>
      </div>
    </div>
  );
}