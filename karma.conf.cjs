const puppeteer =
    require(
        "puppeteer"
    );


module.exports =
    async function (config) {

        process.env.CHROME_BIN =
            await puppeteer
                .executablePath();


        config.set({

            basePath:
                "",


            frameworks: [
                "jasmine"
            ],


            files: [

                {
                    pattern:
                        "src/tests/**/*.spec.js",

                    watched:
                        true
                }

            ],


            preprocessors: {

                "src/tests/**/*.spec.js": [
                    "esbuild"
                ]

            },


            esbuild: {

                target:
                    "es2020",

                jsx:
                    "automatic",

                sourcemap:
                    "inline",

                singleBundle:
                    false

            },


            reporters: [
                "progress"
            ],


            browsers: [
                "ChromeHeadless"
            ],


            client: {

                jasmine: {

                    random:
                        false

                }

            },


            autoWatch:
                true,

            singleRun:
                true,

            restartOnFileChange:
                true

        });

    };