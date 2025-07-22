
// Sample file content generators for testing
export class TestFileGenerator {
  static generateSampleXML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<cabinet>
  <metadata>
    <version>XML_CAB_2.1</version>
    <type>Base Cabinet - Double Door</type>
    <created>2024-01-15</created>
  </metadata>
  <dimensions>
    <parameter name="width" value="36" unit="inches"/>
    <parameter name="height" value="34.5" unit="inches"/>
    <parameter name="depth" value="24" unit="inches"/>
    <parameter name="door_style" value="Shaker"/>
    <parameter name="hinge_type" value="European"/>
  </dimensions>
  <parts>
    <part name="Left Side Panel" type="panel"/>
    <part name="Right Side Panel" type="panel"/>
    <part name="Top Panel" type="panel"/>
    <part name="Bottom Panel" type="panel"/>
    <part name="Back Panel" type="panel"/>
    <part name="Shelf" type="shelf"/>
    <part name="Left Door" type="door"/>
    <part name="Right Door" type="door"/>
  </parts>
  <constraints>
    <constraint>Door swing clearance: 90 degrees minimum</constraint>
    <constraint>Maximum shelf load: 50 lbs</constraint>
  </constraints>
</cabinet>`;
  }

  static generateSampleCAB(): string {
    return `VERSION=CAB_2.0
CABINET_TYPE=Wall Cabinet - Single Door
WIDTH=24
HEIGHT=30
DEPTH=12
DOOR_STYLE=Raised Panel
HINGE_TYPE=European
MATERIAL=Maple
FINISH=Natural
PART_SIDE_PANEL_LEFT=1
PART_SIDE_PANEL_RIGHT=1
PART_TOP=1
PART_BOTTOM=1
PART_BACK=1
PART_DOOR=1
PART_SHELF=2`;
  }

  static generateSampleMZB(): string {
    return `[GENERAL]
Version=MZB_3.2
CabinetType=Base Drawer Cabinet
Created=2024-01-15
Modified=2024-01-20

[DIMENSIONS]
Width=18
Height=34.5
Depth=24
DrawerCount=3

[PARTS]
Side Panel Left
Side Panel Right
Top
Bottom
Back Panel
Drawer Box 1
Drawer Box 2
Drawer Box 3
Drawer Front 1
Drawer Front 2
Drawer Front 3

[HARDWARE]
Drawer Slides=Soft Close Full Extension
Handles=Modern Bar Pull`;
  }

  static generateBrokenXML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<cabinet>
  <metadata>
    <version></version>
    <type>Broken Cabinet</type>
  </metadata>
  <dimensions>
    <parameter name="width" value="NaN" unit="inches"/>
    <parameter name="height" value="0" unit="inches"/>
    <parameter name="" value="24"/>
  </dimensions>
  <parts>
    <part name="" type=""/>
  </parts>
</cabinet>`;
  }

  static createTestFile(content: string, filename: string): File {
    const blob = new Blob([content], { type: 'text/plain' });
    return new File([blob], filename, { type: 'text/plain' });
  }
}

export const sampleFiles = {
  validXML: () => TestFileGenerator.createTestFile(
    TestFileGenerator.generateSampleXML(), 
    'sample_cabinet.xml'
  ),
  validCAB: () => TestFileGenerator.createTestFile(
    TestFileGenerator.generateSampleCAB(), 
    'wall_cabinet.cab'
  ),
  validMZB: () => TestFileGenerator.createTestFile(
    TestFileGenerator.generateSampleMZB(), 
    'drawer_cabinet.mzb'
  ),
  brokenXML: () => TestFileGenerator.createTestFile(
    TestFileGenerator.generateBrokenXML(), 
    'broken_cabinet.xml'
  )
};
