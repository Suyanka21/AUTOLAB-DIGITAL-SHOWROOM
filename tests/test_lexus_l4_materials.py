import sys
import unittest
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'blender'))
from lexus_l4_materials import material_fields, height_normal

class MaterialFieldsTest(unittest.TestCase):
    def test_periodic_fields_and_neutral_recolourable_base(self):
        u,v=np.meshgrid(np.linspace(0,1,37),np.linspace(0,1,37))
        for kind in ['classic','diamond','perforated']:
            a=material_fields(kind,u,v)
            b=material_fields(kind,u+1,v-1)
            for key in a:
                self.assertTrue(np.isfinite(a[key]).all(),(kind,key))
                np.testing.assert_allclose(a[key],b[key],atol=1e-6)
            self.assertGreaterEqual(a['base'].min(),0)
            self.assertLessEqual(a['base'].max(),1)
            self.assertGreaterEqual(a['roughness'].min(),0)
            self.assertLessEqual(a['roughness'].max(),1)
            self.assertEqual(a['thread'].max()>0,kind=='diamond')
    def test_height_gradient_normal_direction_and_unit_length(self):
        u,v=np.meshgrid(np.arange(128)/128,np.arange(128)/128)
        normal=height_normal(.001*np.sin(2*np.pi*u),.16)
        self.assertLess(normal[0,0,0],.5)
        np.testing.assert_allclose(np.linalg.norm(normal*2-1,axis=2),1,atol=1e-6)
        self.assertTrue((normal[:,:,2]>.5).all())
    def test_rejects_unknown_treatment(self):
        with self.assertRaises(ValueError):material_fields('workshop-certified',np.zeros((2,2)),np.zeros((2,2)))

if __name__=='__main__':unittest.main(argv=[__file__])
