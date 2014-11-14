/*jslint browser: true, devel: true, continue: true, eqeq: false, plusplus: true, todo: true, white: true, indent: 2 */
(function ($) {
  "use strict";
  Drupal.behaviors.TableSearch = {
    attach: function (context, settings) {
      // We need timeout in Drupal context because some core JavaScript
      // might cause trouble if not initialized before.
      setTimeout(function () {
        var id, options = {
          placeholder: Drupal.t("Search")
        };
        if (settings.TableSearch) {
          for (id in settings.TableSearch) {
            if (!settings.TableSearch[id].placeholder) {
              settings.TableSearch[id].placeholder = options.placeholder;
            }
            $(context).find("#" + id).once("tablesearch").tablesearch(settings.TableSearch[id]);
          }
        }
        // Allow non settings-defined tables to be used for tablesearch.
        $(context).find("table.tablesearch").once("tablesearch").tablesearch(options);
      }, 400);
    }
  };
}(jQuery));