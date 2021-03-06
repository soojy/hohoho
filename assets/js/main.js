let host = 'http://127.0.0.1:8000/api'
let web = 'http://127.0.0.1:8000/'

let app = new Vue({
    el: '#app',
    data: {
        page : 'index',
        user : {},
        searchForm: {
            from: 'Moscow',
            to: 'Kazan',
            departing: '2020-10-01',
            returning: '2020-10-13',
            passengers: 1
        },
        filters: {
            startDate: '00:00',
            endDate: '23:59'
        },
        flights: {
            flights_to:[],
            flights_back:[]
        },
        booking : {
            passengers:[
                {
                    first_name: 'Иван',
                    last_name: 'Иванов',
                    birth_date: '2000-07-07',
                    document_number: '1232434234',
                }
            ],
        },
        bookingInfo: {},
        flightsFilter: {
            flights_to:[],
            flights_back:[]
        },
        flightsSelected : {
            flights_to:[],
            flights_back:[]
        },
        pops : [],
        seat: {
            passengerId: '',
            flight:'',
            rows: [1,2,3,4,5,6,7,8,9,10,11,12]
        },
        signUpFrom: {
            first_name: '',
            last_name: '',
            phone: '',
            document_number:'',
            password:'',
        },
        signInForm: {
            phone: '',
            password: ''
        }

    },
    methods: {
        pop(text){
            let index = this.pops.push(text)

            setTimeout(()=>{this.pops.splice(index -1, 1)},1600 )
        },

        async search(){
            this.page = 'search'
            let fromIata, toIata
            await fetch(host + '/airport?query=' + this.searchForm.from )
                .then(res => res.json())
                .then(json => fromIata = json.data.items[0].iata)
            await fetch(host + '/airport?query=' + this.searchForm.to )
                .then(res => res.json())
                .then(json => {toIata = json.data.items[0].iata})
            await fetch(host + '/flight?from='+ fromIata + '&to=' + toIata + '&date1=' + this.searchForm.departing + '&passengers=' + this.searchForm.passengers + (this.searchForm.returning !== '' ? '&date2=' + this.searchForm.returning : ''))
                .then(res => res.json())
                .then(json => {
                    for ( let item of json.data.flights_to) {
                        item.selected = false
                    }
                    for ( let item of json.data.flights_back) {
                        item.selected = false
                    }
                    this.flights = json.data
                })
            this.filterSearch('none')

        },

        filterSearch(by){
            switch (by) {
                case 'none' :
                    this.flightsFilter = this.flights
                    break
                case 'date' :



                    this.flightsFilter.flights_to = this.flightsFilter.flights_to.filter(item => {
                        iDate = new Date('2020-07-07T' + item.form.time);
                        return iDate >= new Date('2020-07-07T' + this.filters.startDate + ':00') && iDate <= new Date('2020-07-07T' + this.filters.endDate + ':00');
                    });

                    this.flightsFilter.flights_back = this.flightsFilter.flights_back.filter(item => {
                        iDate = new Date('2020-07-07T' + item.form.time);
                        return iDate >= new Date('2020-07-07T' + this.filters.startDate + ':00') && iDate <= new Date('2020-07-07T' + this.filters.endDate + ':00');
                    });
                    break
            }
        },

        sortSearch(by){
            switch (by) {
                case 'fast' :
                    this.flightsFilter.flights_to.sort((a, b)=> {
                        let aTime = Math.abs(new Date('2020-07-07T'+a.to.time).getHours() - new Date('2020-07-07T'+a.form.time).getHours()) + Math.abs(new Date('2020-07-07T'+a.to.time).getMinutes() - new Date('2020-07-07T'+a.form.time).getMinutes())
                        let bTime = Math.abs(new Date('2020-07-07T'+b.to.time).getHours() - new Date('2020-07-07T'+b.form.time).getHours()) + Math.abs(new Date('2020-07-07T'+b.to.time).getMinutes() - new Date('2020-07-07T'+b.form.time).getMinutes())
                        return aTime- bTime
                    })
                    this.flightsFilter.flights_back.sort((a, b)=> {
                        let aTime = Math.abs(new Date('2020-07-07T'+a.to.time).getHours() - new Date('2020-07-07T'+a.form.time).getHours()) + Math.abs(new Date('2020-07-07T'+a.to.time).getMinutes() - new Date('2020-07-07T'+a.form.time).getMinutes())
                        let bTime = Math.abs(new Date('2020-07-07T'+b.to.time).getHours() - new Date('2020-07-07T'+b.form.time).getHours()) + Math.abs(new Date('2020-07-07T'+b.to.time).getMinutes() - new Date('2020-07-07T'+b.form.time).getMinutes())
                        return aTime- bTime
                    })
                    break
                case 'cheap' :
                    this.flightsFilter.flights_to.sort((a, b)=> {

                        return a.cost - b.cost
                    })
                    this.flightsFilter.flights_back.sort((a, b)=> {

                        return a.cost - b.cost
                    })
            }
        },

        selectFlight(item, array) {
            switch (array) {
                case 'to' :
                    this.flightsFilter.flights_to.filter(item => {
                        return item.selected
                    }).length === 0 ? item.selected = !item.selected : ''
                    break
                case 'back' :
                    this.flightsFilter.flights_back.filter(item => {
                        return item.selected
                    }).length === 0 ? item.selected = !item.selected : ''
                    break
            }
        },

        toBooking(){
            this.flightsSelected.flights_to =  this.flightsFilter.flights_to.filter(item => {
                return item.selected
            })
            this.flightsSelected.flights_back =  this.flightsFilter.flights_back.filter(item => {
                return item.selected
            })
            if (this.flightsSelected.flights_to.length > 0 && this.searchForm.returning !== ''? this.flightsSelected.flights_back.length > 0 : '') {
                this.page = 'booking'
            } else {
                this.pop(this.searchForm.returning === ''?'Необходимо выбрать 1 рейс' : 'Необходимо выбрать 2 рейсa')
            }

        },

        addPassenger(){
            this.booking.passengers.push({
                first_name: '',
                last_name: '',
                birth_date: '',
                document_number: '',
            })
        },

        delPassenger(index){
            this.booking.passengers.splice(index-1,1)
        },

        async toBookingManagement(){
            let flights
            if (this.searchForm.returning !== ''){
                flights = {
                    flight_from: {
                        date: this.flightsSelected.flights_to[0].form.date,
                        id: this.flightsSelected.flights_to[0].flight_id,
                    },
                    flight_back: {
                        date: this.flightsSelected.flights_back[0].form.date,
                        id: this.flightsSelected.flights_back[0].flight_id,
                    },
                }
            } else  {
                flights = {
                    flight_from: {
                        date: this.flightsSelected.flights_to[0].form.date,
                        id: this.flightsSelected.flights_to[0].flight_id,
                    },
                }
            }

            let bookingCode = await fetch(host + '/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...flights,
                    passengers: this.booking.passengers,

                })
            });
            let content = await bookingCode.json();
            this.booking.code = content.data.code


            let bookingInfo = await fetch(host + '/booking/'+ this.booking.code);
            content = await bookingInfo.json();
            this.bookingInfo = content.data
            this.page = 'booking_management'
        },

        toSeat(passengerId,flight) {
            this.seat.passengerId = passengerId
            this.seat.flight = flight
            this.page = 'seat'
        },

        selectSeat(seat){
             fetch(host + `/booking/`+ this.bookingInfo.code +`/seat`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    passenger : this.seat.passengerId,
                    seat : seat,
                    type : this.seat.flight
                })
            })
                .then(res =>{
                    if (res.status === 422) {
                        this.pop('Место '+ seat + ' уже занято')
                    } else {
                        fetch(host + '/booking/'+ this.booking.code)
                            .then(res => res.json())
                            .then(json => this.bookingInfo = json.data)
                        this.page = 'booking_management'

                    }


                } )

        },

        signIn(){
            fetch(host + '/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.signInForm)
            })
                .then(res =>{
                    if (res.status === 200){
                        this.pop('Вы успешно вошли')
                    } else {
                        this.pop('Проверьте введеные данные')
                    }
                    return res.json()
                })
                .then(json => {
                    this.user.token = json.data.token
                    fetch(web +'/user',{
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.user.token
                        }
                    })
                        .then(res =>{
                            if (res.status === 200){
                            } else {
                                this.pop('Что-то пошло не так')
                            }
                            return res.text()
                        })
                        .then(text => {
                            let json = JSON.parse(text)
                            console.log(json)
                            this.user.data = json
                            this.page = 'profile'
                        })
                })


        },

        signUp(){
            fetch(host + '/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.signUpFrom)
            })
                .then(res =>{
                    if (res.status === 204){
                        this.pop('Вы успешно зарегестрировались')
                        this.page = 'login'
                    } else {
                        this.pop('Что-то пошло не так')

                    }
                })
        },





    },


})