import { announcementType } from "./announcement";
import { botLogType } from "./botLog";
import { dateOverrideType } from "./dateOverride";
import { donateClickType } from "./donateClick";
import { eventType } from "./event";
import { monthlyScheduleType } from "./monthlySchedule";
import { prayerConfigType } from "./prayerConfig";
import { programType } from "./program";

export const schemaTypes = [
  prayerConfigType,
  dateOverrideType,
  monthlyScheduleType,
  announcementType,
  eventType,
  programType,
  botLogType,
  donateClickType,
];
