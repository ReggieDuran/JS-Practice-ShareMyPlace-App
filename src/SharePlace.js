import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress, getAddresFromCoords } from './Utility/Location';

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');
        this.shareBtn = document.getElementById('share-btn');

        this.shareBtn.addEventListener('click', this.sharePladeHandler);
        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
    }

    sharePladeHandler() {
        const sharedLinkInputEl = document.getElementById('share-link');
        if (!navigator.clipboard) {
            sharedLinkInputEl.select();
            return;
        }
        
        navigator.clipboard.writeText(sharedLinkInputEl.value)
            .then(() => {
                alert('Copied into the clipboard');
            })
            .catch(err => {
                console.log(err);
            });
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }
        this.shareBtn.disabled = false;
        const sharedLinkInputEl = document.getElementById('share-link');
        sharedLinkInputEl.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert('Location is not available in your browser - please use a more modern browser or manually enter a valid address');
            return;
        }
        const modal = new Modal('loading-modal-content', 'Loading location - please wait!');
        modal.show();
        navigator.geolocation.getCurrentPosition(
            async successResult => {
                console.log(successResult)
                setTimeout(() => { modal.hide(); }, 2000);
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude
                };  
                const address = await getAddresFromCoords(coordinates);
                modal.hide();
                this.selectPlace(coordinates, address);
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
            this.selectPlace(coordinates, address);
        } catch (error) {
            alert(error.message);
        }

        modal.hide();
    }
}

const findPlace = new PlaceFinder();