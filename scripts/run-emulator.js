const { exec } = require("child_process");

// Function to list AVDs
function listAVDs() {
    return new Promise((resolve, reject) => {
        exec("emulator -list-avds", (error, stdout, stderr) => {
            if (error) {
                reject(`Error listing AVDs: ${stderr}`);
            } else {
                const avds = stdout.split("\n").filter((avd) => avd);
                resolve(avds);
            }
        });
    });
}

// Function to run the first AVD
function runFirstAVD(avds) {
    if (avds.length === 0) {
        console.log("No AVDs available.");
        return;
    }
    const firstAVD = avds[0];
    console.log(`Running AVD: ${firstAVD}`);
    exec(`emulator -avd ${firstAVD}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running AVD: ${stderr}`);
        } else {
            console.log(`AVD ${firstAVD} is running.`);
        }
    });
}

// Main function to list and run the first AVD
async function main() {
    try {
        const avds = await listAVDs();
        runFirstAVD(avds);
    } catch (error) {
        console.error(error);
    }
}

main();
