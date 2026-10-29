"""End-to-end PNG orientation regression; run after Blender generates source maps."""
from pathlib import Path
import sys
import unittest
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'blender'))
from lexus_l4_materials import material_fields,height_normal,SIZE,TILE_METRES

class SavedImagesTest(unittest.TestCase):
    def test_delivered_ktx_mask_is_localized_and_absent_on_plain_treatments(self):
        for kind in ['classic','diamond','perforated']:
            image=Image.open(ROOT/('blender/out/lexus-l4a/'+kind+'-orm-decoded.png')).convert('RGBA')
            alpha=np.asarray(image)[:,:,3]/255
            coverage=(alpha>.1).mean()
            if kind=='diamond':
                self.assertGreater(coverage,.005)
                self.assertLess(coverage,.05)
                self.assertGreater((alpha<.01).mean(),.90)
            else:self.assertEqual(float(alpha.max()),0)

    def test_gltf_top_row_and_normal_gradient_match_procedural_uv(self):
        v,u=np.mgrid[0:SIZE,0:SIZE]/SIZE
        fields=material_fields('diamond',u,v)
        expected=height_normal(fields['height'],TILE_METRES)
        actual=np.asarray(Image.open(ROOT/'blender/out/lexus-l4a/diamond-normal.png'))[:,:,:3]/255
        # Includes asymmetric grain and angled channels, so row reversal cannot pass.
        self.assertLess(np.abs(actual-expected).max(),.006)
        mask=np.asarray(Image.open(ROOT/'blender/out/lexus-l4a/diamond-orm.png'))[:,:,3]/255
        self.assertLess(np.abs(mask-fields['thread']).max(),.006)
        self.assertGreater((mask>.7).mean(),.005)
        self.assertLess((mask>.1).mean(),.15)

if __name__=='__main__':unittest.main()
