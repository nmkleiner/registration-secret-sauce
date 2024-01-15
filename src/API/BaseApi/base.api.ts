import { ApiInterface } from './api.interface';
import { useProduct } from '../../../excel-registration-front/src/Core/Composables/program/useProduct';
import { TaglitProgram } from './taglit-program.enum';
import { TaglitProduct } from './taglit-product.enum';
import { OnwardCountries } from '../../../excel-registration-front/src/Modules/Onward/Enums/onward-countries.enum';
import { TaglitOrigin } from './taglit-origin.enum';
import {HttpClientInstanceInterface} from "../HttpClient/http-client.interface";
import {AppHttpClient} from "../HttpClient/http-client";

export class BaseApi implements ApiInterface {
  public httpClient: HttpClientInstanceInterface;

  constructor(httpClient: HttpClientInstanceInterface) {
    this.httpClient = httpClient || AppHttpClient.instance;
  }

  public get product(): TaglitProduct {
    const program = useProduct().product.value;

    switch (program) {
      case TaglitProduct.EXCEL:
        return TaglitProduct.EXCEL;
      case TaglitProduct.ONWARD:
        return TaglitProduct.ONWARD;
      // case TaglitProduct.STAFF:
      //   return TaglitProduct.STAFF;
    }
  }
  public get program(): TaglitProgram {
    const program = useProduct().product.value;
    switch (program) {
      case TaglitProduct.EXCEL:
        return TaglitProgram.EXCEL;
      case TaglitProduct.ONWARD:
        return TaglitProgram.ALL;
      // case TaglitProduct.STAFF:
      //   return TaglitProgram.REGULAR;
    }
  }

  public get origin(): TaglitOrigin | string {
    const program = useProduct().product.value;
    switch (program) {
      case TaglitProduct.ONWARD:
        return TaglitOrigin.ONWARD;
      default:
        return '';
    }
  }

  public get createAccountProgram(): TaglitProgram {
    const program = useProduct().product.value;
    switch (program) {
      case TaglitProduct.EXCEL:
        return TaglitProgram.EXCEL;
      case TaglitProduct.ONWARD:
        return TaglitProgram.ONWARD;
      // case TaglitProduct.STAFF:
      //   return TaglitProgram.REGULAR;
    }
  }

  public get country(): string {
    const program = useProduct().product.value;
    switch (program) {
      case TaglitProduct.ONWARD:
        return OnwardCountries.Onward;
      default:
        return null;
    }
  }
}
