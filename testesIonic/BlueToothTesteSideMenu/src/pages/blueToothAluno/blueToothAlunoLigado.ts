import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import {  NgZone } from '@angular/core';


/**
 * Generated class for the AlunoBlueToothLigado page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'blueTooth-aluno-ligado',
  templateUrl: 'blueToothAlunoLigado.html',
})
export class BlueToothAlunoLigadoPage {
  mobiles: any;
  mobileSelected: any;
  isConnected: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public blueTooth:BluetoothSerial, public zone: NgZone) {
    this.blueTooth.list().then(
                (results)=> {
                    this.mobiles =  results;
                    console.log(results);
                },
                function(error) {
                    console.log(error);
                }

    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlueToothAlunoLigado');

    
  }
  itemTapped(event, m) {
    // That's right, we're pushing to ourselves!
    //this.navCtrl.push(ListPage, {
    //  item: item
    //});
    console.log( m.id );

    this.mobileSelected = m;
    //this.navCtrl.setRoot( "BlueToothAlunoTransferenciaPage", { m: m } );
  }
  connect() {
    console.log( "Conectar..." );
    this.isConnected = "uaic";
    var c = this.blueTooth.connect(this.mobileSelected.id);
    this.isConnected = "uaic2";
    
      c.subscribe( 
      (status)=>{
        this.zone.run( ()=>{
        this.isConnected = "uaid";
        this.openPort(status);
      this.isConnected = "conectado!!!";
      }
    );
      },
      error=>{this.showError(error)} ) ;
    
  }

  openPort( status ) {
    console.log( "Conectado....Abrindo porta" );

    console.log( status );
    console.log( this.blueTooth );
    this.blueTooth.subscribe('\n').subscribe( data=> {
            console.log( JSON.stringify(data));
            console.log( "leu algo" );
        },
        error=>{this.showError(error)} );
    

    console.log( "Porta aberta!" );
  }

  closePort() {
    console.log( "Conectado.... Fechando porta???? não tem como???" );
    
    
  }

  showError( error ) {
    console.log( "showError" );
    console.log( error );
  }

  disconnect() {
    console.log( "Desconectando..." );
    this.blueTooth.disconnect().then( ( results ) =>
                {
                    this.closePort();
                    console.log(results);
                    console.log( "Desconectado..." );
                    this.isConnected = "uai 2";
                }, 
                (error) => {
                    console.log(error);
                }
    )
  }
  switchConnectDisconnect( event ) {
    this.isConnected = "uai";
    return this.blueTooth.isConnected().then( ( results ) =>
                {
                    this.isConnected = "uaib";
                    return this.disconnect();
                }, 
                (error) => {
                    this.isConnected = "uaib2";
                    return this.connect();
                }
    )
  }

  sendDataWithoutCheck() {
    console.log( "Enviando" );
    this.blueTooth.write([10,20,30,40,50,'\n']).then( ( results ) =>
                {
                    console.log("Enviou mesmo");
                    console.log(results);
                }, 
                (error) => {

                    console.log("Deu erro");
                    console.log(error);
                });
    
    console.log( "Enviado" );
  }

  sendData( event ) {
    this.blueTooth.isConnected().then( ( results ) =>
                {
                   this.sendDataWithoutCheck(); 
                }, 
                (error) => {
                    console.log(error);
                }
    )
  }

  readData() {
    this.blueTooth.read().then( ( results ) =>
                {
                   console.log( "Lido");
                   console.log( results );
                    
                }, 
                (error) => {
                    console.log(error);
                }
    )
  }
  receiveDataWithoutCheck() {
    console.log( "Recebendo" );
    this.blueTooth.available().then( ( results ) =>
                {
                   console.log( "Available");
                   console.log( results );
                   this.readData(); 
                }, 
                (error) => {
                    console.log(error);
                }
    )

  }

  receiveData( event ) {
    this.blueTooth.isConnected().then( ( results ) =>
                {
                  console.log( "Conectado para receber")
                   this.receiveDataWithoutCheck(); 
                }, 
                (error) => {
                    console.log(error);
                }
    )
  }
}
