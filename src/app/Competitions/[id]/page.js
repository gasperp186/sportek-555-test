import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import CompetitionDetails from "@/components/Competitions/CompetitionDetails";
import ScreenshotButton from "./ScreenshotButton";
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

  const isFormOnly = comp.publishMode === "FORM_ONLY";
  
  // Pogoj, ki določi, kdaj gre za majhen turnir s 4 ekipami
  const jeBracket4 = (comp.mode === "knockout" || comp.mode === "bracket") && comp.maxTeams === 4;

  let screenshotConfig = {
    width: "950px",
    height: "800px",
  };

  if (comp.mode === "ligaski") {
    screenshotConfig = {
      width: "900px",
      height: "1100px", 
    };
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <h2 className={classes.title}>{comp.title}</h2>
        <div className={classes.subtitle}>
          <div className={classes.metaGroup}>
            <div><strong>Šport:</strong> {comp.sport}</div>
            <span className={classes.separator}>|</span>
            <div><strong>Kraj:</strong> {comp.city}</div>
            <span className={classes.separator}>|</span>
            <div><strong>Lokacija:</strong> {comp.location}</div>
            <span className={classes.separator}>|</span>
          </div>
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
              <><strong>Sezona:</strong> {comp.season}</>
            )}
          </div>
        </div>
        
        <CompetitionDetails id={id} initialData={comp} isEditMode={true} />
        
        {/* Dinamična zamenjava razreda za širino vrste */}
        <div
          className={jeBracket4 ? classes.ozjaVrsta : classes.vrsta}
          style={isFormOnly ? { justifyContent: 'center' } : {}}
        >
          {!isFormOnly && (
            <div className={classes.legendWrapper}>
              <Legenda />
            </div>
          )}

          {!isFormOnly && (
            <div className={classes.screenShotDiv}>
              <ScreenshotButton 
                comp={comp}
                className={classes.screenshotButton} 
                width={screenshotConfig.width}
                height={screenshotConfig.height} 
                contentToExport={
                  <CompetitionDetails id={id} initialData={comp} isExport={true} />
                }
              />
            </div>
          )}

          <div className={classes.rulesWrapper}>
            <RulesButton rules={comp.rulesText}/>
          </div>
        </div>
        
       
        <BackButton/>
      </div>
    </div>
  );
}