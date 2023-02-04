const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// many-to-many relationship
// possible two-way refererening -- but embedding is used here
