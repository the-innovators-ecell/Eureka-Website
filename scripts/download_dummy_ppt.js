const https = require('https');
const fs = require('fs');

const file = fs.createWriteStream("public/resources/Ideathon_Presentation_Guide.pptx");
https.get("https://file-examples.com/storage/fe22d86fbe66bab8e8888f4/2017/08/file_example_PPT_250kB.ppt", function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();  
    console.log("Download complete");
  });
}).on('error', function(err) {
  fs.unlink("public/resources/Ideathon_Presentation_Guide.pptx");
  console.error("Error: ", err.message);
});
