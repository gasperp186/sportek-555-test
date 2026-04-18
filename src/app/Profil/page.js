"use client";

import { useState } from "react";

import ProfileBar from "@/components/Profil/ProfileBar";
import MyCompetitions from "@/components/Profil/MyCompetitions";
import EditProfile from "@/components/Profil/EditProfile";
import ProfileSecurity from "@/components/Profil/ProfileSecurity";
import ProfilePage from "@/components/Profil/ProfilePage";
import classes from "./Profile.module.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profil");

  return (
    <div className={classes.page}>
      <aside className={classes.leftCol}>
        <ProfileBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </aside>

      <section className={classes.rightCol}>
          {activeTab === "profil" && <ProfilePage />}

        {activeTab === "tekmovanja" && <MyCompetitions />}
        {activeTab === "uredi" && <EditProfile />}
        {activeTab === "varnost" && <ProfileSecurity />}
      </section>
    </div>
  );
}
