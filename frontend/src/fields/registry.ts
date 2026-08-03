import { FieldConfig } from './FieldConfig';
import { PercentField } from './PercentField';
import { BooleanField } from './BooleanField';
import { DeadzoneField } from './DeadzoneField';
import { FloatField } from './FloatField';
import { IntegerField } from './IntegerField';
import { ColorField } from './ColorField';
import { DropdownField } from './DropdownField';
import { TransformField } from './TransformField';

FieldConfig.registry['percent'] = PercentField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
FieldConfig.registry['boolean'] = BooleanField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
FieldConfig.registry['deadzone'] = DeadzoneField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
FieldConfig.registry['float'] = FloatField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
FieldConfig.registry['integer'] = IntegerField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
FieldConfig.registry['color'] = ColorField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
FieldConfig.registry['dropdown'] = DropdownField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
FieldConfig.registry['transform'] = TransformField as unknown as new (data: import('./FieldConfig').FieldData) => FieldConfig;
