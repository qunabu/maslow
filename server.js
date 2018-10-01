var browserSync = require('browser-sync').create();
browserSync.init({
    files : ["./js/*", "*.html", "*.js"],
    server: {
        baseDir: "./"
    }
});