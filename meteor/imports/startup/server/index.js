// Import server startup through a single index entry point

import './fixtures';
import './register-api';

import './signup'

import {Random} from 'meteor/random'
console.log(Random.id())
