/**
 * Script to scan and clean defacement text from products in MongoDB.
 * Usage: node scripts/clean-defacement.js [--dry-run | --apply]
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function cleanDefacement() {
  const isApply = process.argv.includes('--apply');
  console.log(`=== SUNRISE GADGETS DEFACEMENT SCANNER (${isApply ? 'APPLY MODE' : 'DRY RUN MODE'}) ===\n`);

  if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    const dns = require('dns');
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
      const origLookup = dns.lookup;
      dns.lookup = function (hostname, options, callback) {
        if (typeof options === 'function') { callback = options; options = {}; }
        dns.resolve4(hostname, (err, addresses) => {
          if (!err && addresses && addresses.length > 0) {
            if (options && options.all) return callback(null, addresses.map((addr) => ({ address: addr, family: 4 })));
            return callback(null, addresses[0], 4);
          }
          return origLookup(hostname, options, callback);
        });
      };
    } catch (e) {}

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} total products in database.\n`);

    let affectedCount = 0;

    for (const prod of products) {
      let isDefaced = false;
      const changes = {};

      // Check name
      if (/ghostbyte/i.test(prod.name) || /hacked/i.test(prod.name)) {
        isDefaced = true;
        changes.name = `${prod.brand || 'Product'} (${prod.category || 'Item'})`;
      }

      // Check brand
      if (/ghostbyte/i.test(prod.brand) || /hacked/i.test(prod.brand)) {
        isDefaced = true;
        changes.brand = 'Sunrise Gadgets';
      }

      // Check description
      if (prod.description && /ghostbyte/i.test(prod.description)) {
        isDefaced = true;
        changes.description = prod.description.replace(/hacked\s*by\s*ghostbyte/gi, '').trim();
      }

      // Check images
      const cleanedImages = (prod.images || []).filter(img => {
        if (!img.url || /pinimg\.com.*fc5a2025b338cc8da83f50a15a1052b9/i.test(img.url)) {
          isDefaced = true;
          return false; // Remove the attacker gif
        }
        return true;
      });

      if (isDefaced) {
        affectedCount++;
        console.log(`⚠️ Product [${prod._id}]: Category="${prod.category}"`);
        console.log(`   Current Name: "${prod.name}"`);
        console.log(`   Current Brand: "${prod.brand}"`);
        console.log(`   Current Price: ${prod.price}`);
        console.log(`   Defaced Images: ${(prod.images || []).length - cleanedImages.length} removed`);

        if (isApply) {
          if (changes.name) prod.name = changes.name;
          if (changes.brand) prod.brand = changes.brand;
          if (changes.description !== undefined) prod.description = changes.description;
          prod.images = cleanedImages;
          await prod.save();
          console.log(`   ✅ Cleaned and saved product ${prod._id}`);
        }
        console.log('--------------------------------------------------');
      }
    }

    console.log(`\nScan complete! Found ${affectedCount} affected product(s).`);
    if (!isApply && affectedCount > 0) {
      console.log('\nTo apply automatic defacement text and image clean-up, run:');
      console.log('node scripts/clean-defacement.js --apply');
      console.log('\nNote: You can also edit product names, prices, and images directly from the Admin Dashboard after logging in.');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error running scan:', err.message);
    process.exit(1);
  }
}

cleanDefacement();
