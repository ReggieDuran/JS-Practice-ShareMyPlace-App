import { Modal } from './UI/Modal';

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');

        locateUserBtn.addEventListener('click', this.locateUserHandler);
        addressForm.addEventListener('submit', this.findAddressHandler);
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert('Location is not available in your browser - please use a more modern browser or manually enter a valid address');
            return;
        }
        const modal = new Modal('loading-modal-content', 'Loading location - please wait!');
        modal.show();
        navigator.geolocation.getCurrentPosition(
            successResult => {
                console.log(successResult)
                setTimeout(() => { modal.hide(); }, 2000);
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude
                };
            }, 
            error => { 
                modal.hide();
                alert('Could not locate you unfortunately. Please enter an address manually!');
            }
        );
    }

    findAddressHandler() {

    }
}

new PlaceFinder();