import { db } from "../firebaseConfig";
import chalk from "chalk";
import { logo } from "../asciiLogo";
import { getGCPEmail, getProjectId } from "./utils";
import { getRowyApp, registerRowyApp } from "./createRowyApp";
import { logError } from "./createRowyApp";
//import { updateConfig } from "./utils";

async function start() {
  try {
    const projectId = getProjectId();
    const rowyRunUrl = process.env.SERVICE_URL;
    const rowyAppURL = `https://${process.env.GOOGLE_CLOUD_PROJECT}.rowy.app/setup?rowyRunUrl=${process.env.SERVICE_URL}`;
    const update = {
      rowyRunBuildStatus: "COMPLETE",
      rowyRunUrl,
    };
    await db.doc("/_rowy_/settings").update(update);

    const gcpEmail = await getGCPEmail();
    if (typeof gcpEmail !== "string") {
      throw new Error("cloud shell ");
    }
    const userManagement = {
      owner: {
        email: gcpEmail,
      },
    };

    await db.doc("_rowy_/userManagement").set(userManagement, { merge: true });

    const firebaseConfig = await getRowyApp(projectId);
    const { success, message }: any = await registerRowyApp({
      ownerEmail: gcpEmail,
      firebaseConfig,
      secret: process.env.ROWY_SECRET,
    });
    if (!success) throw new Error(message);
    console.log(chalk.green("Successfully created rowy app"));
    console.log(logo);
    console.log(
      `
  🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩
  🟩  🎊  Successfully deployed Rowy Run 🎊                                                  🟩
  🟩                                                                                       🟩
  🟩  Continue the setup process by going to the link below:                               🟩
  🟩  👉 ${rowyAppURL}  🟩
  🟩                                                                                       🟩
  🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩`
    );
  } catch (error: any) {
    console.log(error);
    logError({
      event: "post-create",
      error: error.message,
    });
  }
}

start();
