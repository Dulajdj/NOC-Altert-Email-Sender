const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const RecipientGroup = require('./models/RecipientGroup');

dotenv.config();
const app = express();
app.use(express.static('public'));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    const groups = [
      { name: "Access Switch - PLC_GIT", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - PLC_ESD", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - PLC_SECRETARIAL", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - PLC_FINANCE", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - PLC_CPMD", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - PLC_GHR", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - PLC_SPDU", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - HO_ROUTER", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - FL_ROUTER", to: "asanka.chandana@groupit.hayleys.com;deemantha.weerakoon@groupit.hayleys.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - KVPL", to: "susantha@kvpl.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - AVENTURA", to: "sandeepa.p@hayleysaventura.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - DPL_HO", to: "sampath.h@dplgroup.com;indika.wickramaratna@dplgroup.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Switch - HBSI", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },

      /*
      { name: "Access Point - GROUP_IT", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - ADVANTIS", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - HAYCARB", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - AVENTURA", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - HPL", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - KVPL", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - LEISURE", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - AGRO", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - CONSUMER", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - FIBRE", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - DPL", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - CPMD", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - TTEL", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      { name: "Access Point - MARTIN BOURE", to: "dihan.vidanagamage@hayleysbsi.com", cc: "noc@groupit.hayleys.com" },
      */

      { name: "Core Switch - Agro", to: "mariyo.dias@agro.hayleys.com;vipula.ramanayake@agro.hayleys.com;thilina.munasinghe@agro.hayleys.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Alumex", to: "lakmal.kuruppu@alumexgroup.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Aventura", to: "sandeepa.p@hayleysaventura.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Consumer Product", to: "Chathura.Ekanayaka@consumer.hayleys.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - DPL", to: "indika.wickramaratna@dplgroup.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Fibre", to: "eco.it@hayleysfibre.com;shirantha.rajakaruna@ravi.hayleys.com;prasanna.kurera@hayleysfibre.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Haycarb", to: "rasika.jayawardena@haycarb.com;mahinda.rajasinghe@haycarb.com;ams@haycarb.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Fabric", to: "chamira.dias@hayleysfabric.com;tharanga.rodrigo@hayleysfabric.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Leisure", to: "shiran.t@hayleysleisure.com;farhaan.f@hayleysleisure.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - HBSI", to: "dihan.vidanagamage@hayleysbsi.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Kelani Valley Plantation", to: "susantha@kvpl.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Core Switch - Talawakelle Tea Estate", to: "madhura.suraweera@ttel.hayleys.com;dushan.hettiarachchi@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },

      { name: "Firewall - Agro", to: "mariyo.dias@agro.hayleys.com;vipula.ramanayake@agro.hayleys.com;thilina.munasinghe@agro.hayleys.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Agro HJS", to: "ranmal.kumara@hjs.hayleys.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Fiber", to: "eco.it@hayleysfibre.com;shirantha.rajakaruna@ravi.hayleys.com;prasanna.Kurera@hayleysfibre.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Alumex", to: "lakmal.kuruppu@alumexgroup.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Amaya", to: "shiran.tissera@hayleysleisure.com;farhaan.fazan@hayleysleisure.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Advantis", to: "sandun.pasqual@hayleysadvantis.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Leisure", to: "shiran.t@hayleysleisure.com;farhaan.f@hayleysleisure.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - DPL", to: "indika.wickramaratna@dplgroup.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Haycarb", to: "rasika.jayawardena@haycarb.com;mahinda.rajasinghe@haycarb.com;ams@haycarb.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Mabroc Tea", to: "didula.jayasooriya@mabrocteas.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - SAT", to: "sameera.jayakody@satextile.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - External(Palo Alto)", to: "ramya.peiris@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Internal(Fortigate)", to: "samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Fabric", to: "chamira.dias@hayleysfabric.com;tharanga.Rodrigo@hayleysfabric.com;dineth.pathirana@hayleysfentons.com;samitha.indika@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - HBSI", to: "dihan.Vidanagamage@hayleysbsi.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Firewall - Martin Bource", to: "susanthaM@martin-bauer-hayleys.com;yasirul@martin-bauer-hayleys.com;samitha.indika@hayleysfentons.com;dineth.pathirana@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },

      { name: "Avamar", to: "saranga.dissanayake@groupit.hayleys.com;shehan.classen@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },
      { name: "Virtual Machine- V Center", to: "saranga.dissanayake@groupit.hayleys.com;shehan.classen@hayleysfentons.com", cc: "noc@groupit.hayleys.com" },

      { name: "Test - Test", to: "fentons.techsupport@hayleysfentons.com", cc: "fentons.techsupport@hayleysfentons.com" },
      { name: "Test2 - Test2", to: "hansa2001dulaj@gmail.com", cc: "fentonsnoc@gmail.com" },
      { name: "Test3 - Test3", to: "dasanayakeh7@gmail.com", cc: "hansa2001dulaj@gmail.com" }


    ];
    for (let g of groups) {
      await RecipientGroup.findOneAndUpdate({ name: g.name }, g, { upsert: true });
    }
    console.log('Recipient groups initialized');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/email', require('./routes/email'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
