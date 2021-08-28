import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress } from './Utility/Location';

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');

        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
    }

    selectPlace(coordinates) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }
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
                this.selectPlace(coordinates);
            }, 
            error => { 
                modal.hide();
                alert('Could not locate you unfortunately. Please enter an address manually!');
            }
        );
    }

    async findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;
        if (!address || address.trim().length === 0) {
            alert('Invalid address entered - please try again!');
            return;
        }

        const modal = new Modal('loading-modal-content', 'Loading location - please wait!');
        modal.show();

        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates);
        } catch (error) {
            alert(error.message);
        }

        modal.hide();
    }
}

const findPlace = new PlaceFinder();