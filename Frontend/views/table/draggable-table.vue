  <!-- eslint-disable vue/no-unused-vars -->
<template>
  <v-data-table
    :headers="columnNames"
    :items="rows"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    group-by="ilo_ip"
    sort-by="rowNum"
    loading
    loading-text="Loading... Please wait"
    item-key="rowNum"
    show-expand
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Expandable Table</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-switch
          v-model="singleExpand"
          label="Single expand"
          class="mt-2"
        ></v-switch>
      </v-toolbar>
              <!-- <v-chip
          :color="getColor(item.calories)"
          dark
        >
          {{ item.calories }}
        </v-chip> -->
    </template>
    <template v-slot:expanded-item="{headers, item}">
      <td :colspan="headers.length"> {{ item.data }}</td>
    </template>
  </v-data-table>
</template>

<script>
import { keys } from 'lodash'

var data = {
  '10.60.51.124': {
    aggregate_health_status_data: {
      num_OK: 9,
      num_total: 9,
      meta_data: { num_OK: 9, num_total: 9 },
      body: {
        BiosOrHardwareHealth: 'OK',
        Fans: 'OK',
        Memory: 'OK',
        Network: 'OK',
        PowerSupplies: 'OK',
        Processors: 'OK',
        SmartStorageBattery: 'OK',
        Storage: 'OK',
        Temperatures: 'OK'
      }
    },
    device_inventory_data: {
      num_OK: 4,
      num_total: 4,
      body: [
        {
          Location: 'PCI-E Slot 1',
          ProductName: 'Empty slot 1',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'PCI-E Slot 2',
          ProductName: 'Empty slot 2',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'Embedded LOM',
          ProductName: 'Network Controller',
          FirmwareVersion: '20.12.41',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded LOM',
          ProductName: 'Empty',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'Embedded RAID',
          ProductName: 'HPE Smart Array P408i-a SR Gen10',
          FirmwareVersion: '1.66',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded Device',
          ProductName: 'HPE Smart Storage Battery',
          FirmwareVersion: '0.60',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded Device',
          ProductName: 'Embedded Video Controller',
          FirmwareVersion: '2.5',
          Health: 'OK',
          State: 'Enabled'
        }
      ]
    },
    fans_data: {
      num_OK: 7,
      num_total: 7,
      meta_data: { num_OK: 7, num_total: 7, total_number_of_fans: 7 },
      body: [
        {
          Name: 'Fan 1',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 2',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 3',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 4',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 5',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 6',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 7',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        }
      ]
    },
    memory_data: {
      num_OK: 2,
      num_total: 2,
      meta_data: { total_memory_slots: 24, num_OK: 2, num_total: 2 },
      body: [
        { DeviceLocator: 'PROC 1 DIMM 8', DIMMStatus: 'GoodInUse' },
        { DeviceLocator: 'PROC 2 DIMM 8', DIMMStatus: 'GoodInUse' }
      ]
    },
    processors_data: {
      meta_data: { num_OK: 2, num_total: 2 },
      num_OK: 2,
      num_total: 2,
      body: [
        {
          Model: 'Intel(R) Xeon(R) Gold 5118 CPU @ 2.30GHz',
          State: 'Enabled',
          Health: 'OK'
        },
        {
          Model: 'Intel(R) Xeon(R) Gold 5118 CPU @ 2.30GHz',
          State: 'Enabled',
          Health: 'OK'
        }
      ]
    },
    temperature_data: {
      meta_data: { num_OK: 30, num_total: 45 },
      num_OK: 30,
      num_total: 45,
      body: [
        {
          Name: '01-Inlet Ambient',
          Health: 'OK',
          State: 'Enabled',
          Reading: 24,
          UpperThresholdCritical: 42,
          UpperThresholdFatal: 47
        },
        {
          Name: '02-CPU 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 70,
          UpperThresholdFatal: null
        },
        {
          Name: '03-CPU 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 55,
          UpperThresholdCritical: 70,
          UpperThresholdFatal: null
        },
        {
          Name: '04-P1 DIMM 1-6',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '06-P1 DIMM 7-12',
          Health: 'OK',
          State: 'Enabled',
          Reading: 41,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: null
        },
        {
          Name: '08-P2 DIMM 1-6',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '10-P2 DIMM 7-12',
          Health: 'OK',
          State: 'Enabled',
          Reading: 49,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: null
        },
        {
          Name: '12-HD Max',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '13-Exp Bay Drive',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '14-Stor Batt 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 31,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '15-Front Ambient',
          Health: 'OK',
          State: 'Enabled',
          Reading: 31,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '16-VR P1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '17-VR P2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '18-VR P1 Mem 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '19-VR P1 Mem 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '20-VR P2 Mem 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '21-VR P2 Mem 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 43,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '22-Chipset',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '23-BMC',
          Health: 'OK',
          State: 'Enabled',
          Reading: 75,
          UpperThresholdCritical: 110,
          UpperThresholdFatal: 115
        },
        {
          Name: '24-BMC Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 46,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '25-HD Controller',
          Health: 'OK',
          State: 'Enabled',
          Reading: 66,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '26-HD Cntlr Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 42,
          UpperThresholdCritical: 85,
          UpperThresholdFatal: 90
        },
        {
          Name: '27-LOM',
          Health: 'OK',
          State: 'Enabled',
          Reading: 61,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '28-LOM Card',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '29-I/O Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 36,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '30-PCI 1',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '31-PCI 1 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '32-PCI 2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '33-PCI 2 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '34-PCI 3',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '35-PCI 3 Zone',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '37-Rear HD Max',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '38-Battery Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 43,
          UpperThresholdCritical: 75,
          UpperThresholdFatal: 80
        },
        {
          Name: '39-P/S 1 Inlet',
          Health: 'OK',
          State: 'Enabled',
          Reading: 40,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '40-P/S 2 Inlet',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '41-P/S 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 41,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '42-P/S 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 52,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '43-E-Fuse',
          Health: 'OK',
          State: 'Enabled',
          Reading: 38,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '44-P/S 2 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 75,
          UpperThresholdFatal: 80
        },
        {
          Name: '69-PCI 1 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '70-PCI 1 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '71-PCI 2 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '72-PCI 2 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '73-PCI 3 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '74-PCI 3 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        }
      ]
    }
  },
  '10.60.51.74': {
    aggregate_health_status_data: {
      num_OK: 9,
      num_total: 9,
      meta_data: { num_OK: 9, num_total: 9 },
      body: {
        BiosOrHardwareHealth: 'OK',
        Fans: 'OK',
        Memory: 'OK',
        Network: 'OK',
        PowerSupplies: 'OK',
        Processors: 'OK',
        SmartStorageBattery: 'OK',
        Storage: 'OK',
        Temperatures: 'OK'
      }
    },
    device_inventory_data: {
      num_OK: 4,
      num_total: 4,
      body: [
        {
          Location: 'PCI-E Slot 1',
          ProductName: 'Empty slot 1',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'PCI-E Slot 2',
          ProductName: 'Empty slot 2',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'Embedded LOM',
          ProductName: 'Network Controller',
          FirmwareVersion: '20.12.41',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded LOM',
          ProductName: 'Empty',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'Embedded RAID',
          ProductName: 'HPE Smart Array P408i-a SR Gen10',
          FirmwareVersion: '1.66',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded Device',
          ProductName: 'HPE Smart Storage Battery',
          FirmwareVersion: '0.60',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded Device',
          ProductName: 'Embedded Video Controller',
          FirmwareVersion: '2.5',
          Health: 'OK',
          State: 'Enabled'
        }
      ]
    },
    fans_data: {
      num_OK: 7,
      num_total: 7,
      meta_data: { num_OK: 7, num_total: 7, total_number_of_fans: 7 },
      body: [
        {
          Name: 'Fan 1',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 2',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 3',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 4',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 5',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 6',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 7',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        }
      ]
    },
    memory_data: {
      num_OK: 2,
      num_total: 2,
      meta_data: { total_memory_slots: 24, num_OK: 2, num_total: 2 },
      body: [
        { DeviceLocator: 'PROC 1 DIMM 8', DIMMStatus: 'GoodInUse' },
        { DeviceLocator: 'PROC 2 DIMM 8', DIMMStatus: 'GoodInUse' }
      ]
    },
    processors_data: {
      meta_data: { num_OK: 2, num_total: 2 },
      num_OK: 2,
      num_total: 2,
      body: [
        {
          Model: 'Intel(R) Xeon(R) Gold 5118 CPU @ 2.30GHz',
          State: 'Enabled',
          Health: 'OK'
        },
        {
          Model: 'Intel(R) Xeon(R) Gold 5118 CPU @ 2.30GHz',
          State: 'Enabled',
          Health: 'OK'
        }
      ]
    },
    temperature_data: {
      meta_data: { num_OK: 30, num_total: 45 },
      num_OK: 30,
      num_total: 45,
      body: [
        {
          Name: '01-Inlet Ambient',
          Health: 'OK',
          State: 'Enabled',
          Reading: 24,
          UpperThresholdCritical: 42,
          UpperThresholdFatal: 47
        },
        {
          Name: '02-CPU 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 70,
          UpperThresholdFatal: null
        },
        {
          Name: '03-CPU 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 55,
          UpperThresholdCritical: 70,
          UpperThresholdFatal: null
        },
        {
          Name: '04-P1 DIMM 1-6',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '06-P1 DIMM 7-12',
          Health: 'OK',
          State: 'Enabled',
          Reading: 41,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: null
        },
        {
          Name: '08-P2 DIMM 1-6',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '10-P2 DIMM 7-12',
          Health: 'OK',
          State: 'Enabled',
          Reading: 49,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: null
        },
        {
          Name: '12-HD Max',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '13-Exp Bay Drive',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '14-Stor Batt 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 31,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '15-Front Ambient',
          Health: 'OK',
          State: 'Enabled',
          Reading: 31,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '16-VR P1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '17-VR P2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '18-VR P1 Mem 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '19-VR P1 Mem 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '20-VR P2 Mem 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '21-VR P2 Mem 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 43,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '22-Chipset',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '23-BMC',
          Health: 'OK',
          State: 'Enabled',
          Reading: 75,
          UpperThresholdCritical: 110,
          UpperThresholdFatal: 115
        },
        {
          Name: '24-BMC Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 46,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '25-HD Controller',
          Health: 'OK',
          State: 'Enabled',
          Reading: 66,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '26-HD Cntlr Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 42,
          UpperThresholdCritical: 85,
          UpperThresholdFatal: 90
        },
        {
          Name: '27-LOM',
          Health: 'OK',
          State: 'Enabled',
          Reading: 61,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '28-LOM Card',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '29-I/O Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 36,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '30-PCI 1',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '31-PCI 1 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '32-PCI 2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '33-PCI 2 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '34-PCI 3',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '35-PCI 3 Zone',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '37-Rear HD Max',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '38-Battery Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 43,
          UpperThresholdCritical: 75,
          UpperThresholdFatal: 80
        },
        {
          Name: '39-P/S 1 Inlet',
          Health: 'OK',
          State: 'Enabled',
          Reading: 40,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '40-P/S 2 Inlet',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '41-P/S 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 41,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '42-P/S 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 52,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '43-E-Fuse',
          Health: 'OK',
          State: 'Enabled',
          Reading: 38,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '44-P/S 2 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 75,
          UpperThresholdFatal: 80
        },
        {
          Name: '69-PCI 1 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '70-PCI 1 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '71-PCI 2 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '72-PCI 2 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '73-PCI 3 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '74-PCI 3 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        }
      ]
    }
  },
  '10.60.777.124': {
    aggregate_health_status_data: {
      num_OK: 9,
      num_total: 9,
      meta_data: { num_OK: 9, num_total: 9 },
      body: {
        BiosOrHardwareHealth: 'OK',
        Fans: 'OK',
        Memory: 'OK',
        Network: 'OK',
        PowerSupplies: 'OK',
        Processors: 'OK',
        SmartStorageBattery: 'OK',
        Storage: 'OK',
        Temperatures: 'OK'
      }
    },
    device_inventory_data: {
      num_OK: 4,
      num_total: 4,
      body: [
        {
          Location: 'PCI-E Slot 1',
          ProductName: 'Empty slot 1',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'PCI-E Slot 2',
          ProductName: 'Empty slot 2',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'Embedded LOM',
          ProductName: 'Network Controller',
          FirmwareVersion: '20.12.41',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded LOM',
          ProductName: 'Empty',
          FirmwareVersion: 'N/A',
          State: 'Absent'
        },
        {
          Location: 'Embedded RAID',
          ProductName: 'HPE Smart Array P408i-a SR Gen10',
          FirmwareVersion: '1.66',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded Device',
          ProductName: 'HPE Smart Storage Battery',
          FirmwareVersion: '0.60',
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Location: 'Embedded Device',
          ProductName: 'Embedded Video Controller',
          FirmwareVersion: '2.5',
          Health: 'OK',
          State: 'Enabled'
        }
      ]
    },
    fans_data: {
      num_OK: 7,
      num_total: 7,
      meta_data: { num_OK: 7, num_total: 7, total_number_of_fans: 7 },
      body: [
        {
          Name: 'Fan 1',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 2',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 3',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 4',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 5',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 6',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        },
        {
          Name: 'Fan 7',
          Location: 'System',
          Speed: 15,
          Health: 'OK',
          State: 'Enabled'
        }
      ]
    },
    memory_data: {
      num_OK: 2,
      num_total: 2,
      meta_data: { total_memory_slots: 24, num_OK: 2, num_total: 2 },
      body: [
        { DeviceLocator: 'PROC 1 DIMM 8', DIMMStatus: 'GoodInUse' },
        { DeviceLocator: 'PROC 2 DIMM 8', DIMMStatus: 'GoodInUse' }
      ]
    },
    processors_data: {
      meta_data: { num_OK: 2, num_total: 2 },
      num_OK: 2,
      num_total: 2,
      body: [
        {
          Model: 'Intel(R) Xeon(R) Gold 5118 CPU @ 2.30GHz',
          State: 'Enabled',
          Health: 'OK'
        },
        {
          Model: 'Intel(R) Xeon(R) Gold 5118 CPU @ 2.30GHz',
          State: 'Enabled',
          Health: 'OK'
        }
      ]
    },
    temperature_data: {
      meta_data: { num_OK: 30, num_total: 45 },
      num_OK: 30,
      num_total: 45,
      body: [
        {
          Name: '01-Inlet Ambient',
          Health: 'OK',
          State: 'Enabled',
          Reading: 24,
          UpperThresholdCritical: 42,
          UpperThresholdFatal: 47
        },
        {
          Name: '02-CPU 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 70,
          UpperThresholdFatal: null
        },
        {
          Name: '03-CPU 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 55,
          UpperThresholdCritical: 70,
          UpperThresholdFatal: null
        },
        {
          Name: '04-P1 DIMM 1-6',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '06-P1 DIMM 7-12',
          Health: 'OK',
          State: 'Enabled',
          Reading: 41,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: null
        },
        {
          Name: '08-P2 DIMM 1-6',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '10-P2 DIMM 7-12',
          Health: 'OK',
          State: 'Enabled',
          Reading: 49,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: null
        },
        {
          Name: '12-HD Max',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '13-Exp Bay Drive',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '14-Stor Batt 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 31,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '15-Front Ambient',
          Health: 'OK',
          State: 'Enabled',
          Reading: 31,
          UpperThresholdCritical: 60,
          UpperThresholdFatal: null
        },
        {
          Name: '16-VR P1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '17-VR P2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '18-VR P1 Mem 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '19-VR P1 Mem 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 35,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '20-VR P2 Mem 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '21-VR P2 Mem 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 43,
          UpperThresholdCritical: 115,
          UpperThresholdFatal: 120
        },
        {
          Name: '22-Chipset',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '23-BMC',
          Health: 'OK',
          State: 'Enabled',
          Reading: 75,
          UpperThresholdCritical: 110,
          UpperThresholdFatal: 115
        },
        {
          Name: '24-BMC Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 46,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '25-HD Controller',
          Health: 'OK',
          State: 'Enabled',
          Reading: 66,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '26-HD Cntlr Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 42,
          UpperThresholdCritical: 85,
          UpperThresholdFatal: 90
        },
        {
          Name: '27-LOM',
          Health: 'OK',
          State: 'Enabled',
          Reading: 61,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '28-LOM Card',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '29-I/O Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 36,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '30-PCI 1',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '31-PCI 1 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '32-PCI 2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '33-PCI 2 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 39,
          UpperThresholdCritical: 90,
          UpperThresholdFatal: 95
        },
        {
          Name: '34-PCI 3',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '35-PCI 3 Zone',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '37-Rear HD Max',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '38-Battery Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 43,
          UpperThresholdCritical: 75,
          UpperThresholdFatal: 80
        },
        {
          Name: '39-P/S 1 Inlet',
          Health: 'OK',
          State: 'Enabled',
          Reading: 40,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '40-P/S 2 Inlet',
          Health: 'OK',
          State: 'Enabled',
          Reading: 45,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '41-P/S 1',
          Health: 'OK',
          State: 'Enabled',
          Reading: 41,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '42-P/S 2',
          Health: 'OK',
          State: 'Enabled',
          Reading: 52,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '43-E-Fuse',
          Health: 'OK',
          State: 'Enabled',
          Reading: 38,
          UpperThresholdCritical: 100,
          UpperThresholdFatal: null
        },
        {
          Name: '44-P/S 2 Zone',
          Health: 'OK',
          State: 'Enabled',
          Reading: 50,
          UpperThresholdCritical: 75,
          UpperThresholdFatal: 80
        },
        {
          Name: '69-PCI 1 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '70-PCI 1 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '71-PCI 2 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '72-PCI 2 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '73-PCI 3 M2',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        },
        {
          Name: '74-PCI 3 M2 Zn',
          Health: 'N/A',
          State: 'Absent',
          Reading: 0,
          UpperThresholdCritical: null,
          UpperThresholdFatal: null
        }
      ]
    }
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function print(string) {
  console.log(string)
}

var rows = []
var rowNum = 0
for (var ip in data) {
  console.log(ip)

  for (var type in data[ip]) {
    rowNum++
    print(type)

    var strArr = type.split('_')
    print(strArr)
    var name = ''
    var count = 0
    for (var i = 0; i < strArr.length; i++) {
      strArr[i] = capitalizeFirstLetter(strArr[i])
    }
    name = strArr.join(' ')
    var row = {
      ilo_ip: ip,
      type: name,
      num_OK: data[ip][type].num_OK,
      num_failures: data[ip][type].num_total - data[ip][type].num_OK,
      percent_failures: Math.round(
        ((data[ip][type].num_total - data[ip][type].num_OK) /
          data[ip][type].num_total) *
          100
      ),
      status: 'happy',
      data: data[ip][type].body,
      rowNum: rowNum,
      calories: 450

    }
    print(row)
    rows.push(row)
  }
}
print(rows)
export default {
  methods: {
    getColor(calories) {
      if (calories > 400) return 'red'
      else if (calories > 200) return 'orange'
      else return 'green'
    }
  },
  data() {
    return {
      expanded: [],
      singleExpand: true,
      columnNames: [
        {
          text: 'ILO IP: ',
          align: 'start',
          sortable: false,
          value: 'ilo_ip'
        },
        { text: 'Data Type', value: 'type' },
        { text: 'Number OK', value: 'num_failures' },
        { text: 'Number Failures', value: 'num_failures' },
        { text: 'Percent Failures', value: 'percent_failures' },
        { text: 'Status', value: 'status' }
      ],
      rows: rows,
      loading: true
    }
  }
}
</script>
