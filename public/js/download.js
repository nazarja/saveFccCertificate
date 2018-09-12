
function downloadCertificate() {

    const radioButtons = document.getElementsByClassName('radioButtons');
    const infoMessage = document.getElementById('infoMessage');
    let name = document.querySelector('.verify').innerText;
    name = name.match(/[a-z||-]{1,}$/gim);

    let logo = document.querySelector('div.logo img.img-responsive');
    let signature = document.querySelector('div.row.signatures img.img-responsive');

    logo.src =  'freecodecamp_logo.svg';
    signature.src = 'signature.png';




    let option;
    for(let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            option = radioButtons[i].value;
        }
    }

    if (!option) {
        infoMessage.innerText = "Please select an option!";
        return;
    }


    function createImage() {

        html2canvas(document.body, {
            "windowWidth": 1500,
            "windowHeight": 1080,
            "height": 880,
            "width": 1500
        }).then(function(canvas) {
            $('capture').html("");
            $('capture').append(canvas);
            let capture = $('capture');

            switch(option) {
                case 'image':
                    image(canvas);
                    break;
                case 'pdf':
                    pdf(canvas);
                    break;
                default:
                    break;
            }
        });
    
        function image(canvas) {
            console.log("image");
            $('#captureCert').attr('href', canvas.toDataURL("image/png"));
            $('#captureCert').attr('download',`${name}-certificate.png`);
            $('#captureCert')[0].click();
        }
        
        function pdf(canvas) {
            console.log("pdf");
            canvas.getContext('2d');
            let imgData = canvas.toDataURL("image/jpeg");
            let pdf = new jsPDF('l', 'mm', [397, 232]);
            pdf.addImage(imgData, 'JPEG', 0, 0);
            pdf.save(`${name}-certificate.pdf`);
        }
    }
    createImage();
}
