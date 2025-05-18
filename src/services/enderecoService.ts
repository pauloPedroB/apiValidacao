// src/services/usuarioService.ts
import { Endereco } from '../models/Endereco';
import { Usuario } from '../models/Usuario';

import { EnderecoModel } from '../models/EnderecoModel';

const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'openstreetmap', // usa o Nominatim por padrão
    httpAdapter: 'https',
    formatter: null
  };



export class EnderecoService {
    static async buscarEndereco(filtro: { id_usuario?: number; id_endereco?: number; }): Promise<Endereco | null> {
      let endereco: Endereco | null =  null;
      if (filtro.id_usuario !== undefined) {
            endereco = await EnderecoModel.buscarEndereco({id_usuario: filtro.id_usuario});
      }
      else if (filtro.id_endereco !== undefined) {
            endereco = await EnderecoModel.buscarEndereco({ id_endereco: filtro.id_endereco });
      }
      else {
          throw new Error("Nenhum parâmetro enviado");
        }

      if (!endereco){
        return null
      }
      return endereco
    }
    static async criar(endereco: { rua: String; bairro: String; cidade: String; cep: String; uf: String; nmr: number; latitude: String; longitude: String ; usuario: Usuario; complemento: String;}): Promise<void> {
  
        const novo_endereco = new Endereco(
            endereco.rua,
            endereco.bairro,
            endereco.cidade,
            endereco.cep,
            endereco.uf,
            endereco.nmr,
            endereco.latitude,
            endereco.longitude,
            endereco.usuario,
            undefined,
            endereco.complemento
            );

        await EnderecoModel.criar(novo_endereco);
    }

    static async editar(endereco: { rua: String; bairro: String; cidade: String; cep: String; uf: String; nmr: number; latitude: String; longitude: String ; usuario: Usuario; complemento: String;}): Promise<void> {
  
        const novo_endereco = new Endereco(
            endereco.rua,
            endereco.bairro,
            endereco.cidade,
            endereco.cep,
            endereco.uf,
            endereco.nmr,
            endereco.latitude,
            endereco.longitude,
            endereco.usuario,
            undefined,
            endereco.complemento
            );

        await EnderecoModel.editar(novo_endereco);
    }
    
    static async contarDistancia(endereco1: Endereco, endereco2: Endereco): Promise<number>{
        function toRadians(degrees) {
            return degrees * (Math.PI / 180);
        }
        const R = 6371; // Raio da Terra em quilômetros

        const lat1 = Number(endereco1.latitude);
        const lon1 = Number(endereco1.longitude);

        const lat2 = Number(endereco2.latitude);
        const lon2 = Number(endereco2.longitude);


        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distancia = R * c;
        return distancia; // Retorna a distância em quilômetros
    }

    static async BuscarCEP(cep: string, numero: number): Promise<[boolean,any]>{
        if (cep.length !== 8) {
            return [false, "CEP Inválido"];
        }
    
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
    
            if (!data.erro) {
                const rua = data.logradouro?.slice(0, 65) || "";
                const cidade = data.localidade?.slice(0, 40) || "";
                const uf = data.uf?.slice(0, 2) || "";
                const bairro = data.bairro?.slice(0, 40) || "";
                const endereco_formatado = `${rua}, ${numero}, ${cidade}, ${uf}, Brasil`;
    
                const latlong = await this.obterLatLong(endereco_formatado, bairro, cidade);
                if(latlong == null){
                    return [false, "Erro ao encontrar Latitude e Longitude"];
                }
    
                return [true,{rua: rua, cidade: cidade, uf:uf,bairro: bairro, latitude: latlong.latitude, longitude: latlong.longitude}]
            } else {
                return [false, "CEP Inválido"];
            }
    
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
            return [false, "Erro ao buscar o CEP"];
        }
    }
    
    static async obterLatLong(endereco, bairro, cidade) {
        const geocoder = NodeGeocoder(options);
        console.log(endereco)
        try {
            // Tenta buscar pelo endereço completo
            let res = await geocoder.geocode(endereco);
            if (res.length > 0) {
            return { latitude: res[0].latitude, longitude: res[0].longitude };
            }
        } catch (error) {
            console.log('Não encontrado pelo nome da rua')
        }

        const enderecoBairroCidade = `${bairro}, ${cidade}, Brasil`;
        try {
            let res = await geocoder.geocode(enderecoBairroCidade);
            if (res.length > 0) {
            return { latitude: res[0].latitude, longitude: res[0].longitude };
            }
        } catch (error) {
            console.log('Não encontrado pelo bairro e cidade')
        }

        const enderecoCidade = `${cidade}, Brasil`;
        try {
            let res = await geocoder.geocode(enderecoCidade);
            if (res.length > 0) {
            return { latitude: res[0].latitude, longitude: res[0].longitude };
            }
        } catch (error) {
            console.log("Não encontrado pela cidade")
        }

        return null;
    }
    

}
