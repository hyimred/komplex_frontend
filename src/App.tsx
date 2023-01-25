import React, { Component, MouseEventHandler } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import { getValue } from '@testing-library/user-event/dist/utils';

interface State {
  Storages: Storage[];
  regNev: string;
  regMeret: string;
  regAr: string;
  regType: string
}

interface Storage {
  id: number
  name: string;
  size: number;
  price: number;
  type: string
}

interface StorageListResponse {
  storage: Storage[];
}

class App extends Component<{}, State> {

  constructor(props: {}) {
    super(props);

    this.state = {
      regNev: '',
      regMeret: '',
      regAr: '',
      regType: '',
      Storages: [],
    }
  }


  async loadStorage() {
    let response = await fetch('http://localhost:3000/api/tarhely');
    let data = await response.json() as StorageListResponse;
    this.setState({
      Storages: data.storage,
    })
  }

  componentDidMount() {
    this.loadStorage();
  }

  handleNew = async () => {

    const { regNev, regMeret, regAr, regType } = this.state;
    if (regNev.trim() === '') {
      // this.setState() -tel hibaüzenet megjelenítése
      return;
    }

    const adat = {
      name: regNev,
      size: regMeret,
      price: regAr,
      type: regType
    };

    let response = await fetch('http://localhost:3000/api/tarhely', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adat),
    });

    this.setState({
      regNev: '',
      regMeret: '',
      regAr: '',
      regType: '',
    })

    await this.loadStorage();

  }

  async handleDelete(id: number) {
        let response = await fetch('http://localhost:3000/api/tarhely/' + id, {
          method: 'DELETE'
        });
        await this.loadStorage();

  };

  render() {
    const { regNev, regMeret, regAr, regType } = this.state;

    return <div className='container'>
      <h2>Tárhelyek</h2>
      <div className="row d-flex flex-row m-2">
      {this.state.Storages.map(Storage => <div className="col-md-4 col-sm-12 bg-primary p-2 text-center border border-dark">
                                              <h4 className="text-white">{Storage.name}</h4>
                                              <p className="text-white">{Storage.size}GB</p>
                                              <p className="text-white">{Storage.price}Ft</p>
                                              <p className="text-white">{Storage.type}</p>
                                              <button className='btn btn-danger btn-sm' onClick={() => this.handleDelete(Storage.id)}>Törlés</button>
                                          </div>)}  
      </div>

      <h2>Új Tárhely</h2>

      <form>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Tárhely neve:</span>
          </div>
          <input type="text" className="form-control" value={regNev} onChange={e => this.setState({ regNev: e.currentTarget.value })}></input>
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Tárhely mérete:</span>
          </div>
          <input type="text" className="form-control" value={regMeret} onChange={e => this.setState({ regMeret: e.currentTarget.value })}></input>
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Tárhely ára:</span>
          </div>
          <input type="text" className="form-control" value={regAr} onChange={e => this.setState({ regAr: e.currentTarget.value })}></input>
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Tárhely tipusa:</span>
          </div>
          <input type="text" className="form-control" value={regType} onChange={e => this.setState({ regType: e.currentTarget.value })}></input>
        </div>

        <button className='btn btn-outline-primary' onClick={this.handleNew}>Új Tárhely</button>

      </form>
      
    </div >;
  }
}

export default App;
