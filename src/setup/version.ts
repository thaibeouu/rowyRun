
import { Request,Response } from "express";
import {db} from '../firebaseConfig'
const meta =  require('../../package.json')
export const version =  async (req:Request, res:Response) => {
    const settings = await db.doc('_rowy_/settings').get()
    const {rowyRunRegion} = settings.data()
    res.send({ version: meta.version,
    region: rowyRunRegion
    });
  }