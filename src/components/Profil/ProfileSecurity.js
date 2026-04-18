import { useState } from "react";
import classes from "./profileSecurity.module.css";
import ProfileBar from "@/components/Profil/ProfileBar";

export default function ProfileSecurity() {
  const [form, setForm] = useState({
    email: "yourname@gmail.com",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.email.trim()) {
      setError("Vnesi e-poštni naslov.");
      return;
    }
    if (form.password.length < 6) {
      setError("Geslo mora imeti vsaj 6 znakov.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Gesli se ne ujemata.");
      return;
    }

    console.log("Saved security settings:", form);
    setSaved(true);
    setError("");
  }

  return (
    <div className={classes.page}>
      

      <section className={classes.rightCol}>
        <div className={classes.rightCard}>
          <div className={classes.headRight}>
            <h2 className={classes.naslov}>Varnost</h2>
          </div>

          <div className={classes.divider} />

          <form onSubmit={handleSubmit} className={classes.form}>
            <label>
              E-pošta
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Vnesi e-pošto"
                required
              />
            </label>

            <label>
              Novo geslo
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Vnesi novo geslo"
                required
              />
            </label>

            <label>
              Potrdi geslo
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Ponovno vnesi geslo"
                required
              />
            </label>

            {error && <p className={classes.error}>{error}</p>}
            {saved && (
              <p className={classes.success}>✅ Spremembe so shranjene</p>
            )}

            <button type="submit" className={classes.primary}>
              Shrani spremembe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
