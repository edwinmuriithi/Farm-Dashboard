import * as yup from 'yup';
import ifasOptions from '../../data/ifas.json';

const ifas = {
  'Supplements Issuing to Client': [
    {
      name: 'supplementsIssued',
      label: 'Were iron supplements issued to the patient?',
      type: 'radio',
      validate: yup
        .string()
        .required('Supplements Issuing to Client is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      name: 'drugName',
      label: 'If yes, specify the drug given',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Elemental iron', value: 'Elemental iron' },
        { label: 'Combined tablets', value: 'Combined tablets' },
      ],
      relevant: formValues => formValues.supplementsIssued === 'Yes',
    },
    {
      name: 'reasonNotIssued',
      label: 'If no, provide reason',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.supplementsIssued === 'No',
    },
    {
      name: 'equivalentDose',
      label: 'Any other equivalent provided',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'ANC Contact': [
    {
      name: 'ancContact',
      label: 'ANC Contact',
      type: 'select',
      validate: yup.string().required('ANC Contact is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 8,
      },
      options: Object.keys(ifasOptions).map(key => ({
        value: key,
        label: key,
      })),
    },
    {
      name: 'timingOfContact',
      label: 'Timing of contact',
      type: 'display',
      content: '',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      relevant: formValues => formValues.ancContact,
    },
    {
      name: 'noOfTablets',
      label: 'No of tablets',
      type: 'display',
      content: '',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      relevant: formValues => formValues.ancContact,
    },
  ],
  Dosage: [
    {
      name: 'dosageAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'dosageFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'dosageDateGiven',
      label: 'Date given',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'benefitsCounselingDone',
      label: 'Was benefits of iron and folic acid counseling done?',
      type: 'radio',
      validate: yup
        .string()
        .required('Benefits of iron and folic acid counseling is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
  ],
};

export default ifas;
