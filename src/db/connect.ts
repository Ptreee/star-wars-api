import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'd64v6f88pvossv',
  'oeinpvkhlnzuvr',
  '3ab661d53170d28af83965bae7385eafe10d728cac2d1fe9ade98d91d75a758e',
  {
    host: 'ec2-52-212-228-71.eu-west-1.compute.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
  },
);

export default sequelize;
