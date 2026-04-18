import urediClasses from "./UrediPrijave.module.css";
import createClasses from "./Create.module.css";

export default function UrediPrijave({
  form,
  setForm,
  onBack,
  onNext,
}) {
  return (
    <div className={createClasses.page}>
      <form className={urediClasses.card}>
        <h2 className={createClasses.naslov}>Nastavitve prijav</h2>


        {form.mode === "knockout" && (

          <div className={urediClasses.row2}>
          <div className={urediClasses.control}>
            <label className={createClasses.label} htmlFor="maxTeams">
              Največ ekip
            </label>
           <select
  id="maxTeams"
  className={createClasses.input}
  value={form.maxTeams}
  onChange={(e) =>
    setForm((p) => ({
      ...p,
      maxTeams: Number(e.target.value),
    }))
  }
>
  <option value={4}>4 ekipe</option>
  <option value={8}>8 ekip</option>
  <option value={16}>16 ekip</option>
</select>
          </div>

          <div className={urediClasses.control}>
            <label className={createClasses.label} htmlFor="registrationDeadline">
              Prijave do datuma
            </label>
            <input
              id="registrationDeadline"
              type="date"
              className={createClasses.input}
              value={form.registrationDeadline}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  registrationDeadline: e.target.value,
                }))
              }
            />
          </div>
        </div>


        )}

        {form.mode === "league" && (

          <div className={urediClasses.row2}>
          <div className={urediClasses.control}>
            <label className={createClasses.label} htmlFor="maxTeams">
              Največ ekip
            </label>
            <input
              id="maxTeams"
              type="number"
              min="3"
              max="64"
              className={createClasses.input}
              value={form.maxTeams}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  maxTeams: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className={urediClasses.control}>
            <label className={createClasses.label} htmlFor="registrationDeadline">
              Prijave do datuma
            </label>
            <input
              id="registrationDeadline"
              type="date"
              className={createClasses.input}
              value={form.registrationDeadline}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  registrationDeadline: e.target.value,
                }))
              }
            />
          </div>
        </div>


        )}

        

        <div className={urediClasses.infoBox}>
          <p>
            Po izteku roka prijav in zapolnitvi mest ekipe ne bodo več mogle
            oddati prijave.
          </p>
        </div>

        <div className={createClasses.actions}>
          <button
            type="button"
            className={`${createClasses.btn} ${createClasses.btnOutline}`}
            onClick={onBack}   
          >
            Nazaj
          </button>

          <button
            type="button"
            className={createClasses.btn}
            onClick={onNext}  
          >
            Naprej
          </button>
        </div>
      </form>
    </div>
  );
}
