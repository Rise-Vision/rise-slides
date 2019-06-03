import { dedupingMixin } from "@polymer/polymer/lib/utils/mixin.js";
import { version } from "./rise-slides-version.js";

export const LoggerMixin = dedupingMixin(base => {
  class Logger extends base {
    constructor() {
      super();
    }

    init(id) {
      this.id = id;
    }

    getComponentData() {
      return {
        name: "rise-slides",
        id: this.id,
        version
      };
    }

    log(type, event, details = null, additionalFields) {
      const componentData = this.getComponentData();

      switch ( type ) {
      case "info":
        RisePlayerConfiguration.Logger.info( componentData, event, details, additionalFields );
        break;
      case "warning":
        RisePlayerConfiguration.Logger.warning( componentData, event, details, additionalFields );
        break;
      case "error":
        RisePlayerConfiguration.Logger.error( componentData, event, details, additionalFields );
        break;
      }
    }

    info(event, details = null, additionalFields) {
      this.log("info", event, details, additionalFields);
    }

    error(event, details = null, additionalFields) {
      this.log("error", event, details, additionalFields);
    }
  }

  return Logger;
});
