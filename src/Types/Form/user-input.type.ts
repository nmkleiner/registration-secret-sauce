import { PriorityInput } from '../../../../excel-registration-front/src/Modules/Excel/Entities/FormElements/priority-input';
import { Address } from '../../Interfaces/Form/Inputs/address.interface';

export type UserInput = string | PriorityInput[] | File | Address;
