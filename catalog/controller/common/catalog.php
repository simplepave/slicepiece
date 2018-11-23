<?php
class ControllerCommonCatalog extends Controller {
    public function index()
    {
        $this->load->model('catalog/category');
        $this->load->model('tool/image');

        $category_id = 59;

        $category_info = $this->model_catalog_category->getCategory($category_id);

        if ($category_info) {

            $data['heading_title'] = $category_info['name'];

            $data['categories'] = [];

            $results = $this->model_catalog_category->getCategories($category_id);

            $scheme = $this->request->server['HTTPS']? $this->config->get('config_ssl'): $this->config->get('config_url');

            foreach ($results as $result) {
                $data['categories'][] = [
                    'name' => $result['name'],
                    'href' => $this->url->link('product/category', 'path=' . $category_id . '_' . $result['category_id']),
                    'image' => $scheme . 'image/' . $result['image'],
                ];
            }

            return $this->load->view('common/catalog', $data);
        }
    }
}