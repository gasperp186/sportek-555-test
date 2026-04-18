"use client";


import compClasses from "./CreateCompetition.module.css";
import createClasses from "./Create.module.css";

export default function StepCreateCompetition({ form, setForm, onNext, onBack }) {


  const handleSubmit = (e) => {
    e.preventDefault(); // Prepreči osveževanje strani
    onNext();          // Premakni se na naslednji korak
  };

  const isLongTerm = form.mode === "ligaski" || form.mode === "hybrid";
  const niLiga = form.mode === "knockout" || form.mode === "hybrid";

  return (
    <div className={createClasses.page}>
      <form className={compClasses.card} onSubmit={handleSubmit}>
        <h2 className={createClasses.naslov}>Ustvari tekmovanje</h2>
        {/* <p className={createClasses.podnaslov}>Vnesi osnovne podatke o dogodku.</p> */}

        <div>
          <div className={compClasses.polje}>
            <label className={createClasses.label} htmlFor="name">
              Ime tekmovanja
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={createClasses.input}
              placeholder="npr. Turnir Sežana 2025"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className={compClasses.row2}>
          <div className={compClasses.polje}>
            <label className={createClasses.label} htmlFor="city">
              Kraj
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className={createClasses.input}
              placeholder="Koper, Ljubljana"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              required
            />
          </div>

          <div className={compClasses.polje}>
            <label className={createClasses.label} htmlFor="location">
              Prizorišče (neobvezno)
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className={createClasses.input}
              placeholder="Bonifika - velika dvorana"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>
        </div>

        <div className={compClasses.row2}>
          <div className={compClasses.polje}>
            <label className={createClasses.label} htmlFor="mode">
              Način tekmovanja
            </label>
            <select
              id="mode"
              name="mode"
              className={createClasses.select}
              value={form.mode}
              onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
              required
            >
              <option value="" disabled>Izberi način...</option>
              <option value="knockout">Sistem na izločanje (knockout)</option>
              <option value="ligaski">Ligaški sistem</option>
              <option value="hybrid">Ligaški sistem + knockout</option>
            </select>
          </div>

          <div className={compClasses.poljecheck}>
            <label className={createClasses.label}>Omogoči javne prijave</label>
            <input
              className={compClasses.checkbox}
              type="checkbox"
              checked={form.publicSignups}
              onChange={(e) => setForm((f) => ({ ...f, publicSignups: e.target.checked }))}
            />
          </div>
        </div>
{niLiga && (
  <div className={compClasses.row2}>
         
         <div className={compClasses.poljecheck}>
            
          </div>

          <div className={compClasses.poljecheck3}>
            <label className={createClasses.label}>Tekma za tretje mesto</label>
            <input
              className={compClasses.checkbox}
              type="checkbox"
              checked={form.thirdPlaceMatch}
              onChange={(e) => setForm((f) => ({ ...f, thirdPlaceMatch: e.target.checked }))}
            />
          </div>
        </div>
)}
        

        {/* DINAMIČNI DEL ZA DATUME ALI SEZONO */}
        <div className={compClasses.row2}>
          {isLongTerm ? (
            /* Če je LIGA ali HYBRID -> prikažemo tekstovni vnos za Sezono */
            <div className={compClasses.polje}>
              <label className={createClasses.label} htmlFor="season">Sezona tekmovanja</label>
              <input
                id="season"
                type="text"
                className={createClasses.input}
                placeholder="npr. 2025/26 ali Pomlad 2026"
                value={form.season || ""}
                onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
                required
              />
            </div>
          ) : (
            /* Če je KNOCKOUT -> prikažemo koledarčka */
            <>
              <div className={compClasses.polje}>
                <label className={createClasses.label} htmlFor="startDate">Datum začetka</label>
                <input
                  id="startDate"
                  type="date"
                  className={createClasses.input}
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  required={form.mode === "knockout"}
                />
              </div>
              <div className={compClasses.polje}>
                <label className={createClasses.label} htmlFor="endDate">Datum konca (neobvezno)</label>
                <input
                  id="endDate"
                  type="date"
                  className={createClasses.input}
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
                {form.endDate && form.startDate && form.endDate < form.startDate && (
                  <div className={compClasses.error}>
                    <p style={{color: 'red', fontSize: '12px'}}>Končni datum je pred začetkom.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        

        <div className={createClasses.actions}>
          <button
            type="button"
            className={`${createClasses.btn} ${createClasses.btnOutline}`}
            onClick={onBack}
          >
            Nazaj
          </button>

          <button type="submit" className={createClasses.btn} >
            Naprej
          </button>
        </div>
      </form>
    </div>
  );
}
