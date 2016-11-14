var ui = require('./ui.ts');

for (var key in ui) {
    if (ui.hasOwnProperty(key) && !window.Allihoopa[key]) {
        window.Allihoopa[key] = ui[key];
    }
}
