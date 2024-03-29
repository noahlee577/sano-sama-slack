"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHtmlForInstallPath = void 0;
const logger_1 = require("@slack/logger");
const logger = new logger_1.ConsoleLogger();
// Deprecated: this function will be removed in the near future
// Use the ones from @slack/oauth (v2.5 or newer) instead
function defaultRenderHtmlForInstallPath(addToSlackUrl) {
    logger.warn('This method is deprecated. Use defaultRenderHtmlForInstallPath from @slack/oatuh instead.');
    // TODO: replace the internals of this method with the one from @slack/oauth@2.5 or newer
    return `<html>
      <body>
        <a href="${addToSlackUrl}">
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </body>
    </html>`;
}
exports.default = defaultRenderHtmlForInstallPath;
// Deprecated: this function will be removed in the near future
// For backward-compatibility
function renderHtmlForInstallPath(addToSlackUrl) {
    return defaultRenderHtmlForInstallPath(addToSlackUrl);
}
exports.renderHtmlForInstallPath = renderHtmlForInstallPath;
//# sourceMappingURL=render-html-for-install-path.js.map